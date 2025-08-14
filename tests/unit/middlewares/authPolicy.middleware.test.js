import { beforeEach, describe, expect, test, vi } from 'vitest'
import { ApiError } from '../../../src/utils/apiError.js'

vi.mock('../../../src/middlewares/universalAuth.middleware.js', () => ({
    universalAuth: vi.fn((req, res, next) => next())
}))

import { authPolicy } from '../../../src/middlewares/authPolicy.middleware.js'
import { universalAuth } from '../../../src/middlewares/universalAuth.middleware.js'

describe('authPolicy.middleware', () => {
    let req, res, next

    beforeEach(() => {
        vi.clearAllMocks()
        req = { headers: {} }
        res = {}
        next = vi.fn()
    })

    test('debería permitir sin roles específicos si user presente', () => {
        universalAuth.mockImplementation((rq, rs, nx) => { rq.user = { role: 'user' }; nx() })
        const stack = authPolicy([])
        stack[0](req, res, () => stack[1](req, res, next))
        expect(next).toHaveBeenCalledWith()
    })

    test('debería rechazar 401 si no hay user', () => {
        universalAuth.mockImplementation((rq, rs, nx) => nx())
        const stack = authPolicy(['user'])
        stack[0](req, res, () => stack[1](req, res, next))
        const err = next.mock.calls[0][0]
        expect(err).toBeInstanceOf(ApiError)
        expect(err.statusCode).toBe(401)
    })

    test('debería rechazar 403 si rol no coincide', () => {
        universalAuth.mockImplementation((rq, rs, nx) => { rq.user = { role: 'user' }; nx() })
        const stack = authPolicy(['admin'])
        stack[0](req, res, () => stack[1](req, res, next))
        const err = next.mock.calls[0][0]
        expect(err).toBeInstanceOf(ApiError)
        expect(err.statusCode).toBe(403)
    })

    test('debería permitir si rol coincide', () => {
        universalAuth.mockImplementation((rq, rs, nx) => { rq.user = { role: 'admin' }; nx() })
        const stack = authPolicy(['admin'])
        stack[0](req, res, () => stack[1](req, res, next))
        expect(next).toHaveBeenCalledWith()
    })
})
