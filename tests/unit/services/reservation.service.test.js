import { describe, it, expect, vi, beforeEach } from 'vitest'

let ReservationService
let reservationService
let mockReservationDAO
let mockLodgingDAO

beforeEach(async () => {
    vi.resetModules()
    vi.clearAllMocks()

    vi.mock('../../../src/dao/reservation.dao.js', () => {
        mockReservationDAO = {
            getReservationById: vi.fn(),
            getReservationsByUserId: vi.fn(),
            getReservationsByLodging: vi.fn(),
            getReservations: vi.fn(),
            isLodgingAvailable: vi.fn(),
            createReservation: vi.fn(),
            updateReservation: vi.fn(),
            deleteReservation: vi.fn(),
            getReservationSummaryByLodging: vi.fn()
        }
        return { ReservationDAO: vi.fn(() => mockReservationDAO) }
    })

    vi.mock('../../../src/dao/lodging.dao.js', () => {
        mockLodgingDAO = {
            getLodgingById: vi.fn()
        }
        return { LodgingDAO: vi.fn(() => mockLodgingDAO) }
    })

    const mod = await import('../../../src/services/reservation.service.js')
    ReservationService = mod.ReservationService
    reservationService = new ReservationService(mockReservationDAO, mockLodgingDAO)
})

describe('ReservationService', () => {
    it('getReservationsByUser', async () => {
        mockReservationDAO.getReservationsByUserId.mockResolvedValue([
            { id: 'r1', user: 'user1', lodging: 'l1', totalPrice: 100 }
        ])
        const result = await reservationService.getReservationsByUser('user1')
        expect(mockReservationDAO.getReservationsByUserId).toHaveBeenCalledWith('user1')
        expect(result).toHaveLength(1)
        expect(result[0].id).toBe('r1')
    })

    it('getReservationsWithFilters por lodging', async () => {
        mockReservationDAO.getReservations.mockResolvedValue({
            total: 1,
            page: 1,
            pages: 1,
            data: [{ id: 'r1', lodging: 'l1', user: 'u1', totalPrice: 120 }]
        })
        const result = await reservationService.getReservationsWithFilters({ lodgingId: 'l1', page: 1, limit: 10 })
        expect(mockReservationDAO.getReservations).toHaveBeenCalledWith({ lodging: 'l1' }, { page: 1, limit: 10 })
        expect(result.total).toBe(1)
        expect(result.data[0].id).toBe('r1')
    })
})
