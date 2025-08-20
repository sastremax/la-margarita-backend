import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../../src/services/reservation.service.js', () => ({
    reservationService: {
        getReservationsWithFilters: vi.fn(),
        getReservationsByUser: vi.fn(),
        getReservationById: vi.fn(),
        createReservation: vi.fn(),
        deleteReservation: vi.fn(),
        getReservationSummary: vi.fn()
    }
}))

const mockReq = (overrides = {}) => ({
    params: {},
    query: {},
    body: {},
    user: null,
    ...overrides
})

const mockRes = () => {
    const res = {}
    res.status = vi.fn().mockReturnValue(res)
    res.json = vi.fn().mockReturnValue(res)
    res.end = vi.fn().mockReturnValue(res)
    return res
}

const next = vi.fn()

let controller
let reservationService

beforeEach(async () => {
    vi.resetModules()
    vi.clearAllMocks()
        ; ({ reservationService } = await import('../../../src/services/reservation.service.js'))
    controller = await import('../../../src/controllers/reservation.controller.js')
})

describe('reservation.controller', () => {
    it('getAllReservations - debería delegar en getReservationsWithFilters y devolver 200', async () => {
        const req = mockReq({ query: { page: 1, limit: 5 } })
        const res = mockRes()
        reservationService.getReservationsWithFilters.mockResolvedValue({
            total: 1,
            page: 1,
            pages: 1,
            data: [{ id: 'r1' }]
        })
        await controller.getAllReservations(req, res, next)
        expect(reservationService.getReservationsWithFilters).toHaveBeenCalledWith({ page: 1, limit: 5 })
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            total: 1,
            page: 1,
            pages: 1,
            data: [{ id: 'r1' }]
        })
    })

    it('getReservationsByUser - debería usar req.user.id y devolver 200', async () => {
        const req = mockReq({ user: { id: 'u1', role: 'user' } })
        const res = mockRes()
        reservationService.getReservationsByUser.mockResolvedValue([{ id: 'r1', userId: 'u1' }])
        await controller.getReservationsByUser(req, res, next)
        expect(reservationService.getReservationsByUser).toHaveBeenCalledWith('u1')
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: [{ id: 'r1', userId: 'u1' }] })
    })

    it('getReservationById - debería devolver 403 si no es dueño ni admin', async () => {
        const req = mockReq({ params: { rid: 'r1' }, user: { id: 'u2', role: 'user' } })
        const res = mockRes()
        reservationService.getReservationById.mockResolvedValue({ id: 'r1', userId: 'u1' })
        await controller.getReservationById(req, res, next)
        expect(reservationService.getReservationById).toHaveBeenCalledWith('r1')
        expect(res.status).toHaveBeenCalledWith(403)
        expect(res.json).toHaveBeenCalledWith({ status: 'error', message: 'Access denied' })
    })

    it('getReservationById - debería permitir admin y devolver 200', async () => {
        const req = mockReq({ params: { rid: 'r1' }, user: { id: 'admin', role: 'admin' } })
        const res = mockRes()
        reservationService.getReservationById.mockResolvedValue({ id: 'r1', userId: 'u1' })
        await controller.getReservationById(req, res, next)
        expect(reservationService.getReservationById).toHaveBeenCalledWith('r1')
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: { id: 'r1', userId: 'u1' } })
    })

    it('deleteReservation - debería devolver 200 y success', async () => {
        const req = mockReq({ params: { rid: 'r1' }, user: { id: 'admin', role: 'admin' } })
        const res = mockRes()
        reservationService.deleteReservation.mockResolvedValue(true)
        await controller.deleteReservation(req, res, next)
        expect(reservationService.deleteReservation).toHaveBeenCalledWith('r1')
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ status: 'success' })
    })

    it('getReservationSummary - debería devolver 400 si falta lodgingId', async () => {
        const req = mockReq()
        const res = mockRes()
        await controller.getReservationSummary(req, res, next)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ status: 'error', message: 'lodgingId is required' })
    })

    it('getReservationSummary - debería delegar y devolver 200', async () => {
        const req = mockReq({ query: { lodgingId: 'l1' } })
        const res = mockRes()
        reservationService.getReservationSummary.mockResolvedValue({ nights: 3, revenue: 300 })
        await controller.getReservationSummary(req, res, next)
        expect(reservationService.getReservationSummary).toHaveBeenCalledWith('l1')
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: { nights: 3, revenue: 300 } })
    })
})
