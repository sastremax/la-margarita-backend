import { beforeEach, describe, expect, it } from 'vitest'
import { ApiError } from '../../../src/utils/apiError.js'
import { _setValidator, validateRequest } from '../../../src/middlewares/validateRequest.middleware.js'

describe('validateRequest.middleware', () => {
    let req, res, next

    beforeEach(() => {
        req = {}
        res = {}
        next = vi.fn()
    })

    it('debería pasar si no hay errores', () => {
        _setValidator(() => ({ isEmpty: () => true }))
        validateRequest(req, res, next)
        expect(next).toHaveBeenCalledWith()
    })

    it('debería llamar next con ApiError 400 si hay errores', () => {
        _setValidator(() => ({
            isEmpty: () => false,
            array: () => [{ msg: 'bad' }]
        }))
        validateRequest(req, res, next)
        const err = next.mock.calls[0][0]
        expect(err).toBeInstanceOf(ApiError)
        expect(err.statusCode).toBe(400)
    })
})
