import { beforeEach, describe, expect, test, vi } from 'vitest'
vi.mock('passport', () => ({
    default: { authenticate: vi.fn() }
}))
import passport from 'passport'
import { ApiError } from '../../../src/utils/apiError.js'
import { authPolicy } from '../../../src/middlewares/authPolicy.middleware.js'

describe('authPolicy.middleware', () => {
    let req, res, next

    beforeEach(() => {
        vi.clearAllMocks()
        req = { headers: {} }
        res = {}
        next = vi.fn()
    })

    test('debería permitir sin roles específicos si user presente', () => {
        passport.authenticate.mockImplementation(() => (rq, rs, nx) => { rq.user = { role: 'user' }; nx() })
        const stack = authPolicy([])
        stack[0](req, res, () => stack[1](req, res, next))
        expect(next).toHaveBeenCalledWith()
    })

    test('debería rechazar 401 si no hay user', () => {
        passport.authenticate.mockImplementation(() => (rq, rs, nx) => { nx() })
        const stack = authPolicy(['user'])
        stack[0](req, res, () => stack[1](req, res, next))
        const err = next.mock.calls[0][0]
        expect(err).toBeInstanceOf(ApiError)
        expect(err.statusCode).toBe(401)
    })

    test('debería rechazar 403 si rol no coincide', () => {
        passport.authenticate.mockImplementation(() => (rq, rs, nx) => { rq.user = { role: 'user' }; nx() })
        const stack = authPolicy(['admin'])
        stack[0](req, res, () => stack[1](req, res, next))
        const err = next.mock.calls[0][0]
        expect(err).toBeInstanceOf(ApiError)
        expect(err.statusCode).toBe(403)
    })

    test('debería permitir si rol coincide', () => {
        passport.authenticate.mockImplementation(() => (rq, rs, nx) => { rq.user = { role: 'admin' }; nx() })
        const stack = authPolicy(['admin'])
        stack[0](req, res, () => stack[1](req, res, next))
        expect(next).toHaveBeenCalledWith()
    })
})
