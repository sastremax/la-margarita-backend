import { beforeEach, describe, expect, test, vi } from 'vitest'

vi.mock('../../../src/dao/lodging.dao.js', () => ({
    LodgingDAO: vi.fn().mockImplementation(() => ({}))
}))

vi.mock('../../../src/dao/reservation.dao.js', () => ({
    ReservationDAO: vi.fn().mockImplementation(() => ({}))
}))

import { reservationService } from '../../../src/services/reservation.service.js'

const lodgingDAO = reservationService.lodgingDAO
const reservationDAO = reservationService.reservationDAO

beforeEach(() => {
    lodgingDAO.getLodgingById = vi.fn()
    reservationDAO.getReservationById = vi.fn()
    reservationDAO.getReservationsByUserId = vi.fn()
    reservationDAO.getReservationsByLodging = vi.fn()
    reservationDAO.isLodgingAvailable = vi.fn()
    reservationDAO.createReservation = vi.fn()
    reservationDAO.updateReservation = vi.fn()
    reservationDAO.getReservations = vi.fn()
    reservationDAO.getReservationSummaryByLodging = vi.fn()
    reservationDAO.deleteReservation = vi.fn()
    vi.clearAllMocks()
})

describe('ReservationService', () => {
    test('getReservationById', async () => {
        reservationDAO.getReservationById.mockResolvedValue({ _id: '1', user: 'user1' })
        const result = await reservationService.getReservationById('1')
        expect(result).toHaveProperty('id', '1')
    })

    test('getReservationsByUserId', async () => {
        reservationDAO.getReservationsByUserId.mockResolvedValue([{ _id: '1', user: 'user1' }])
        const result = await reservationService.getReservationsByUserId('user1')
        expect(result).toHaveLength(1)
    })

    test('getReservationsByLodging', async () => {
        reservationDAO.getReservationsByLodging.mockResolvedValue([{ _id: 'r1', lodging: 'l1' }])
        const result = await reservationService.getReservationsByLodging('l1')
        expect(result).toEqual([{ id: 'r1', lodgingId: 'l1', userId: null, checkIn: undefined, checkOut: undefined, guests: undefined, totalPrice: undefined, status: undefined }])
    })

    test('getReservationsWithFilters', async () => {
        reservationDAO.getReservations.mockResolvedValue({
            data: [{ _id: 'r1', user: 'u1' }]
        })
        const result = await reservationService.getReservationsWithFilters({ userId: 'u1' })
        expect(result.data[0]).toHaveProperty('id', 'r1')
    })

    test('deleteReservation', async () => {
        reservationDAO.deleteReservation.mockResolvedValue(true)
        const result = await reservationService.deleteReservation('r1')
        expect(reservationDAO.deleteReservation).toHaveBeenCalledWith('r1')
        expect(result).toBe(true)
    })

    test('createReservation throws if lodging not found', async () => {
        lodgingDAO.getLodgingById.mockResolvedValue(null)
        await expect(reservationService.createReservation({
            userId: 'u1',
            lodgingId: 'l1',
            checkIn: '2025-08-01',
            checkOut: '2025-08-02'
        })).rejects.toThrow('Lodging not found or inactive')
    })

    test('cancelReservation throws if not authorized', async () => {
        reservationDAO.getReservationById.mockResolvedValue({ _id: 'r1', user: 'u1', status: 'confirmed' })
        await expect(reservationService.cancelReservation('r1', 'wrongUser'))
            .rejects.toThrow('Not authorized to cancel this reservation')
    })

    test('cancelReservation throws if already cancelled', async () => {
        reservationDAO.getReservationById.mockResolvedValue({ _id: 'r1', user: 'u1', status: 'cancelled' })
        await expect(reservationService.cancelReservation('r1', 'u1'))
            .rejects.toThrow('Reservation already cancelled')
    })
})
