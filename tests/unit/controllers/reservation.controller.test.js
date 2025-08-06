import { beforeEach, describe, expect, test, vi } from 'vitest'
import * as reservationController from '../../../src/controllers/reservation.controller.js'
import { reservationService } from '../../../src/services/reservation.service.js'

vi.mock('../../../src/services/reservation.service.js', () => ({
    reservationService: {
        getReservationsWithFilters: vi.fn(),
        getReservationById: vi.fn(),
        getReservationsByLodging: vi.fn(),
        getReservationsByUserId: vi.fn(),
        createReservation: vi.fn(),
        updateReservation: vi.fn(),
        cancelReservation: vi.fn(),
        deleteReservation: vi.fn()
    }
}))

describe('reservationController', () => {
    const mockRes = () => {
        const res = {}
        res.status = vi.fn().mockReturnValue(res)
        res.json = vi.fn().mockReturnValue(res)
        res.end = vi.fn().mockReturnValue(res)
        return res
    }

    const next = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
    })

    test('getAllReservations - success', async () => {
        const req = { query: { page: 1 } }
        const res = mockRes()
        reservationService.getReservationsWithFilters.mockResolvedValue({ data: ['r1', 'r2'] })

        await reservationController.getAllReservations(req, res, next)

        expect(reservationService.getReservationsWithFilters).toHaveBeenCalledWith(req.query)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: ['r1', 'r2'] })
    })

    test('getReservationById - success', async () => {
        const req = { params: { rid: 'abc' } }
        const res = mockRes()
        reservationService.getReservationById.mockResolvedValue('reservation')

        await reservationController.getReservationById(req, res, next)

        expect(reservationService.getReservationById).toHaveBeenCalledWith('abc')
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: 'reservation' })
    })

    test('getReservationsByLodging - success', async () => {
        const req = { params: { lid: 'lodging1' } }
        const res = mockRes()
        reservationService.getReservationsByLodging.mockResolvedValue(['r1', 'r2'])

        await reservationController.getReservationsByLodging(req, res, next)

        expect(reservationService.getReservationsByLodging).toHaveBeenCalledWith('lodging1')
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: ['r1', 'r2'] })
    })

    test('getReservationsByUser - success', async () => {
        const req = { params: { uid: 'user1' } }
        const res = mockRes()
        reservationService.getReservationsByUserId.mockResolvedValue(['r1'])

        await reservationController.getReservationsByUser(req, res, next)

        expect(reservationService.getReservationsByUserId).toHaveBeenCalledWith('user1')
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: ['r1'] })
    })

    test('createReservation - success', async () => {
        const req = { body: { lodgingId: '1', checkIn: '2025-09-01', checkOut: '2025-09-02' } }
        const res = mockRes()
        reservationService.createReservation.mockResolvedValue('newReservation')

        await reservationController.createReservation(req, res, next)

        expect(reservationService.createReservation).toHaveBeenCalledWith(req.body)
        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: 'newReservation' })
    })

    test('updateReservation - success', async () => {
        const req = { params: { rid: 'abc' }, body: { guests: 3 } }
        const res = mockRes()
        reservationService.updateReservation.mockResolvedValue('updated')

        await reservationController.updateReservation(req, res, next)

        expect(reservationService.updateReservation).toHaveBeenCalledWith('abc', req.body)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: 'updated' })
    })

    test('cancelReservation - success', async () => {
        const req = { params: { rid: 'abc' }, user: { id: 'user123' } }
        const res = mockRes()
        reservationService.cancelReservation.mockResolvedValue('cancelled')

        await reservationController.cancelReservation(req, res, next)

        expect(reservationService.cancelReservation).toHaveBeenCalledWith('abc', 'user123')
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: 'cancelled' })
    })

    test('deleteReservation - success', async () => {
        const req = { params: { rid: 'abc' } }
        const res = mockRes()
        reservationService.deleteReservation.mockResolvedValue()

        await reservationController.deleteReservation(req, res, next)

        expect(reservationService.deleteReservation).toHaveBeenCalledWith('abc')
        expect(res.status).toHaveBeenCalledWith(204)
        expect(res.end).toHaveBeenCalled()
    })

    test('createReservation - error', async () => {
        const req = { body: {} }
        const res = mockRes()
        const error = new Error('creation failed')
        reservationService.createReservation.mockRejectedValue(error)

        await reservationController.createReservation(req, res, next)

        expect(next).toHaveBeenCalledWith(error)
    })
})
