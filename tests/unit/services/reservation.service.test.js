import { describe, test, expect, vi, beforeEach } from 'vitest'

vi.mock('../../../src/dao/lodging.dao.js', () => {
    return {
        LodgingDAO: vi.fn().mockImplementation(() => ({}))
    }
})

vi.mock('../../../src/dao/reservation.dao.js', () => {
    return {
        ReservationDAO: vi.fn().mockImplementation(() => ({}))
    }
})

// Importación ocurre después del mock
import { reservationService } from '../../../src/services/reservation.service.js'

// Asignamos manualmente los mocks a las instancias reales
const lodgingDAO = reservationService.lodgingDAO
const reservationDAO = reservationService.reservationDAO

// Creamos los mocks y se los pegamos directamente a las instancias
beforeEach(() => {
    lodgingDAO.getLodgingById = vi.fn()
    reservationDAO.getReservationById = vi.fn()
    reservationDAO.getReservationsByUserId = vi.fn()
    reservationDAO.isLodgingAvailable = vi.fn()
    reservationDAO.createReservation = vi.fn()
    reservationDAO.updateReservation = vi.fn()
    reservationDAO.getReservations = vi.fn()
    reservationDAO.getReservationSummaryByLodging = vi.fn()
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
