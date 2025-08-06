import mongoose from 'mongoose'
import { beforeEach, describe, expect, test, vi } from 'vitest'

vi.mock('../../../src/models/reservation.model.js', async () => {
    return {
        default: {
            findById: vi.fn(),
            find: vi.fn(),
            create: vi.fn(),
            findByIdAndUpdate: vi.fn(),
            findOne: vi.fn(),
            countDocuments: vi.fn(),
            aggregate: vi.fn()
        }
    }
})

let ReservationModel
let ReservationDAO
let reservationDAO

beforeEach(async () => {
    vi.clearAllMocks()
    ReservationModel = (await import('../../../src/models/reservation.model.js')).default
        ; ({ ReservationDAO } = await import('../../../src/dao/reservation.dao.js'))
    reservationDAO = new ReservationDAO()
})

describe('ReservationDAO', () => {
    test('getReservationById should validate ID and call findById', async () => {
        const id = new mongoose.Types.ObjectId().toString()
        await reservationDAO.getReservationById(id)
        expect(ReservationModel.findById).toHaveBeenCalledWith(id)
    })

    test('getReservationById should throw if ID is invalid', async () => {
        await expect(reservationDAO.getReservationById('invalid')).rejects.toThrow('Invalid reservation ID')
        expect(ReservationModel.findById).not.toHaveBeenCalled()
    })

    test('getReservationsByUserId should validate ID and call find', async () => {
        const userId = new mongoose.Types.ObjectId().toString()
        await reservationDAO.getReservationsByUserId(userId)
        expect(ReservationModel.find).toHaveBeenCalledWith({ user: userId })
    })

    test('getReservationsByUserId should throw if ID is invalid', async () => {
        await expect(reservationDAO.getReservationsByUserId('invalid')).rejects.toThrow('Invalid user ID')
        expect(ReservationModel.find).not.toHaveBeenCalled()
    })

    test('createReservation should call create with data', async () => {
        const data = { user: 'u1', lodging: 'l1' }
        await reservationDAO.createReservation(data)
        expect(ReservationModel.create).toHaveBeenCalledWith(data)
    })

    test('updateReservation should validate ID and call findByIdAndUpdate', async () => {
        const id = new mongoose.Types.ObjectId().toString()
        const data = { guests: 2 }
        await reservationDAO.updateReservation(id, data)
        expect(ReservationModel.findByIdAndUpdate).toHaveBeenCalledWith(id, data, { new: true })
    })

    test('updateReservation should throw if ID is invalid', async () => {
        await expect(reservationDAO.updateReservation('invalid', {})).rejects.toThrow('Invalid reservation ID')
        expect(ReservationModel.findByIdAndUpdate).not.toHaveBeenCalled()
    })

    test('isLodgingAvailable should validate ID and call findOne with overlap condition', async () => {
        const lodgingId = new mongoose.Types.ObjectId().toString()
        const checkIn = new Date()
        const checkOut = new Date(Date.now() + 86400000)
        await reservationDAO.isLodgingAvailable(lodgingId, checkIn, checkOut)
        expect(ReservationModel.findOne).toHaveBeenCalledWith({
            lodging: lodgingId,
            status: 'confirmed',
            $or: [
                {
                    checkIn: { $lt: checkOut },
                    checkOut: { $gt: checkIn }
                }
            ]
        })
    })

    test('isLodgingAvailable should throw if lodging ID is invalid', async () => {
        await expect(reservationDAO.isLodgingAvailable('invalid', new Date(), new Date())).rejects.toThrow('Invalid lodging ID')
        expect(ReservationModel.findOne).not.toHaveBeenCalled()
    })

    test('getReservations should call countDocuments and find with pagination', async () => {
        ReservationModel.countDocuments.mockResolvedValue(20)

        const populateLodging = vi.fn().mockResolvedValue([])
        const populateUser = vi.fn(() => ({ populate: populateLodging }))
        const sort = vi.fn(() => ({ populate: populateUser }))
        const limit = vi.fn(() => ({ sort }))
        const skip = vi.fn(() => ({ limit }))

        ReservationModel.find.mockReturnValue({ skip })

        await reservationDAO.getReservations({}, { page: 2, limit: 5 })

        expect(ReservationModel.countDocuments).toHaveBeenCalled()
        expect(ReservationModel.find).toHaveBeenCalled()
        expect(skip).toHaveBeenCalledWith(5)
        expect(limit).toHaveBeenCalledWith(5)
        expect(sort).toHaveBeenCalledWith({ checkIn: -1 })
        expect(populateUser).toHaveBeenCalledWith('user', 'firstName lastName')
        expect(populateLodging).toHaveBeenCalledWith('lodging', 'title location')
    })

    test('getReservationSummaryByLodging should call aggregate and format result', async () => {
        const lodgingId = new mongoose.Types.ObjectId().toString()
        ReservationModel.aggregate.mockResolvedValue([
            {
                totalReservations: 2,
                totalNights: 4,
                totalRevenue: 500,
                averageDuration: 2
            }
        ])
        const result = await reservationDAO.getReservationSummaryByLodging(lodgingId)
        expect(ReservationModel.aggregate).toHaveBeenCalled()
        expect(result).toEqual({
            lodgingId,
            totalReservations: 2,
            totalNights: 4,
            totalRevenue: 500,
            averageDuration: 2
        })
    })

    test('getReservationSummaryByLodging should return empty summary if no data', async () => {
        const lodgingId = new mongoose.Types.ObjectId().toString()
        ReservationModel.aggregate.mockResolvedValue([])
        const result = await reservationDAO.getReservationSummaryByLodging(lodgingId)
        expect(result).toEqual({
            lodgingId,
            totalReservations: 0,
            totalNights: 0,
            totalRevenue: 0,
            averageDuration: 0
        })
    })
})
