import { beforeEach, describe, expect, test, vi } from 'vitest'
import * as controller from '../../../src/controllers/reservation.controller.js'
import { reservationService } from '../../../src/services/reservation.service.js'

vi.mock('../../../src/services/reservation.service.js')

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

describe('reservation.controller', () => {
    test('getAllReservations - debería devolver paginación y data', async () => {
        const req = { query: { page: 2, limit: 5, status: 'confirmed' } }
        const res = mockRes()
        reservationService.getReservationsWithFilters.mockResolvedValue({
            total: 12,
            page: 2,
            pages: 3,
            data: [{ id: 'r1' }]
        })
        await controller.getAllReservations(req, res, next)
        expect(reservationService.getReservationsWithFilters).toHaveBeenCalledWith({ page: 2, limit: 5, status: 'confirmed' })
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            total: 12,
            page: 2,
            pages: 3,
            data: [{ id: 'r1' }]
        })
    })

    test('getReservationById - debería usar req.params.rid', async () => {
        const req = { params: { rid: '507f1f77bcf86cd799439011' } }
        const res = mockRes()
        reservationService.getReservationById.mockResolvedValue({ id: 'r1' })
        await controller.getReservationById(req, res, next)
        expect(reservationService.getReservationById).toHaveBeenCalledWith('507f1f77bcf86cd799439011')
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: { id: 'r1' } })
    })

    test('getReservationsByUser - debería usar req.user.id', async () => {
        const req = { user: { id: 'u1' } }
        const res = mockRes()
        reservationService.getReservationsByUserId.mockResolvedValue([{ id: 'r1', userId: 'u1' }])
        await controller.getReservationsByUser(req, res, next)
        expect(reservationService.getReservationsByUserId).toHaveBeenCalledWith('u1')
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: [{ id: 'r1', userId: 'u1' }] })
    })

    test('createReservation - debería devolver 201', async () => {
        const req = { body: { lodgingId: 'l1', checkIn: '2025-08-10', checkOut: '2025-08-12', guests: 2, userId: 'u1' } }
        const res = mockRes()
        reservationService.createReservation.mockResolvedValue({ id: 'r1' })
        await controller.createReservation(req, res, next)
        expect(reservationService.createReservation).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: { id: 'r1' } })
    })

    test('updateReservation - debería pasar rid y body', async () => {
        const req = { params: { rid: '507f1f77bcf86cd799439011' }, body: { status: 'cancelled' } }
        const res = mockRes()
        reservationService.updateReservation.mockResolvedValue({ id: 'r1', status: 'cancelled' })
        await controller.updateReservation(req, res, next)
        expect(reservationService.updateReservation).toHaveBeenCalledWith('507f1f77bcf86cd799439011', { status: 'cancelled' })
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: { id: 'r1', status: 'cancelled' } })
    })

    test('cancelReservation - debería pasar rid y req.user.id', async () => {
        const req = { params: { rid: '507f1f77bcf86cd799439011' }, user: { id: 'u1' } }
        const res = mockRes()
        reservationService.cancelReservation.mockResolvedValue({ id: 'r1', status: 'cancelled' })
        await controller.cancelReservation(req, res, next)
        expect(reservationService.cancelReservation).toHaveBeenCalledWith('507f1f77bcf86cd799439011', 'u1')
        expect(res.status).toHaveBeenCalledWith(200)
    })

    test('deleteReservation - debería devolver 204', async () => {
        const req = { params: { rid: '507f1f77bcf86cd799439011' } }
        const res = mockRes()
        reservationService.deleteReservation.mockResolvedValue(true)
        await controller.deleteReservation(req, res, next)
        expect(reservationService.deleteReservation).toHaveBeenCalledWith('507f1f77bcf86cd799439011')
        expect(res.status).toHaveBeenCalledWith(204)
        expect(res.end).toHaveBeenCalled()
    })

    test('getReservationSummary - 400 si falta lodgingId, 200 si viene por query', async () => {
        const res1 = mockRes()
        await controller.getReservationSummary({ query: {} }, res1, next)
        expect(res1.status).toHaveBeenCalledWith(400)

        const res2 = mockRes()
        reservationService.getReservationSummary.mockResolvedValue({ count: 3, total: 500 })
        await controller.getReservationSummary({ query: { lodgingId: '507f1f77bcf86cd799439011' } }, res2, next)
        expect(reservationService.getReservationSummary).toHaveBeenCalledWith('507f1f77bcf86cd799439011')
        expect(res2.status).toHaveBeenCalledWith(200)
        expect(res2.json).toHaveBeenCalledWith({ status: 'success', data: { count: 3, total: 500 } })
    })
})
