import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../../../src/services/reservation.service.js', () => {
    const getReservationById = vi.fn()
    return { reservationService: { getReservationById }, __mocks: { getReservationById } }
})

import { __mocks } from '../../../../src/services/reservation.service.js'
import { validateReservationExists } from '../../../../src/middlewares/exists/validateReservationExists.js'
import { ApiError } from '../../../../src/utils/apiError.js'

describe('validateReservationExists', () => {
    let req, res, next

    beforeEach(() => {
        vi.clearAllMocks()
        req = { params: { rid: 'r1' } }
        res = {}
        next = vi.fn()
    })

    it('debería adjuntar reservation y seguir si existe', async () => {
        __mocks.getReservationById.mockResolvedValue({ id: 'r1' })
        await validateReservationExists(req, res, next)
        expect(__mocks.getReservationById).toHaveBeenCalledWith('r1')
        expect(req.reservation).toEqual({ id: 'r1' })
        expect(next).toHaveBeenCalled()
    })

    it('debería lanzar 400 si falta rid', async () => {
        req.params = {}
        await validateReservationExists(req, res, next)
        const err = next.mock.calls[0][0]
        expect(err).toBeInstanceOf(ApiError)
        expect(err.statusCode).toBe(400)
    })

    it('debería lanzar 404 si no existe', async () => {
        __mocks.getReservationById.mockResolvedValue(null)
        await validateReservationExists(req, res, next)
        const err = next.mock.calls[0][0]
        expect(err).toBeInstanceOf(ApiError)
        expect(err.statusCode).toBe(404)
    })
})
