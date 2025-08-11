import { beforeEach, describe, expect, test, vi } from 'vitest'
import { validateReservationExists } from '../../../../src/middlewares/exists/validateReservationExists.js'
import { reservationService } from '../../../../src/services/reservation.service.js'
import { ApiError } from '../../../../src/utils/apiError.js'

vi.mock('../../../../src/services/reservation.service.js', () => ({
    reservationService: {
        getReservationById: vi.fn()
    }
}))

describe('validateReservationExists middleware', () => {
    const next = vi.fn()
    const res = {}
    let req

    beforeEach(() => {
        vi.clearAllMocks()
        req = { params: {} }
    })

    test('should call next with 400 if no rid param is provided', async () => {
        await validateReservationExists(req, res, next)

        expect(next).toHaveBeenCalledWith(expect.any(ApiError))
        const error = next.mock.calls[0][0]
        expect(error.statusCode).toBe(400)
        expect(error.message).toBe('Missing reservation ID')
    })

    test('should call next with 404 if reservation is not found', async () => {
        req.params.rid = 'abc123'
        reservationService.getReservationById.mockResolvedValue(null)

        await validateReservationExists(req, res, next)

        expect(reservationService.getReservationById).toHaveBeenCalledWith('abc123')
        expect(next).toHaveBeenCalledWith(expect.any(ApiError))
        const error = next.mock.calls[0][0]
        expect(error.statusCode).toBe(404)
        expect(error.message).toBe('Reservation not found')
    })

    test('should call next with no arguments if reservation is found', async () => {
        req.params.rid = 'abc123'
        reservationService.getReservationById.mockResolvedValue({
            id: 'abc123',
            userId: 'u1',
            lodgingId: 'l1',
            checkIn: '2025-08-01',
            checkOut: '2025-08-03',
            guests: 2,
            totalPrice: 100,
            status: 'confirmed'
        })

        await validateReservationExists(req, res, next)

        expect(reservationService.getReservationById).toHaveBeenCalledWith('abc123')
        expect(next).toHaveBeenCalledWith()
    })

    test('should call next with error if unexpected error occurs', async () => {
        req.params.rid = 'abc123'
        const internalError = new Error('DB failure')
        reservationService.getReservationById.mockRejectedValue(internalError)

        await validateReservationExists(req, res, next)

        expect(next).toHaveBeenCalledWith(internalError)
    })
})
