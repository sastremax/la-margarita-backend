import { describe, test, expect, vi, beforeEach } from 'vitest'
import { ReservationService } from '../../../src/services/reservation.service.js'

// Mocks de métodos DAO (declarados primero para evitar TDZ)
const getLodgingById = vi.fn()
const getReservationById = vi.fn()
const getReservationsByUserId = vi.fn()
const isLodgingAvailable = vi.fn()
const createReservation = vi.fn()
const updateReservation = vi.fn()
const getReservations = vi.fn()
const getReservationSummaryByLodging = vi.fn()

// Mocks de DAOs
vi.mock('../../../src/dao/lodging.dao.js', () => {
    return {
        LodgingDAO: vi.fn().mockImplementation(() => ({
            getLodgingById
        }))
    }
})

vi.mock('../../../src/dao/reservation.dao.js', () => {
    return {
        ReservationDAO: vi.fn().mockImplementation(() => ({
            getReservationById,
            getReservationsByUserId,
            isLodgingAvailable,
            createReservation,
            updateReservation,
            getReservations,
            getReservationSummaryByLodging
        }))
    }
})

beforeEach(() => {
    vi.clearAllMocks()
})

describe('ReservationService', () => {
    test('getReservationById', async () => {
        getReservationById.mockResolvedValue({ _id: '1', user: 'user1' })
        const result = await ReservationService.getReservationById('1')
        expect(result).toHaveProperty('id', '1')
    })

    test('getReservationsByUserId', async () => {
        getReservationsByUserId.mockResolvedValue([{ _id: '1', user: 'user1' }])
        const result = await ReservationService.getReservationsByUserId('user1')
        expect(result).toHaveLength(1)
    })

    test('createReservation throws if lodging not found', async () => {
        getLodgingById.mockResolvedValue(null)
        await expect(ReservationService.createReservation({
            userId: 'u1',
            lodgingId: 'l1',
            checkIn: '2025-08-01',
            checkOut: '2025-08-02'
        })).rejects.toThrow('Lodging not found or inactive')
    })

    test('cancelReservation throws if not authorized', async () => {
        getReservationById.mockResolvedValue({ _id: 'r1', user: 'u1', status: 'confirmed' })
        await expect(ReservationService.cancelReservation('r1', 'wrongUser'))
            .rejects.toThrow('Not authorized to cancel this reservation')
    })

    test('cancelReservation throws if already cancelled', async () => {
        getReservationById.mockResolvedValue({ _id: 'r1', user: 'u1', status: 'cancelled' })
        await expect(ReservationService.cancelReservation('r1', 'u1'))
            .rejects.toThrow('Reservation already cancelled')
    })
})
