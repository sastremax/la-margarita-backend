import { beforeEach, describe, expect, test, vi } from 'vitest'
vi.mock('../../../src/utils/jwt.util.js', () => ({
    jwtUtil: { verifyAccessToken: vi.fn() }
}))
import { jwtUtil } from '../../../src/utils/jwt.util.js'
import { ApiError } from '../../../src/utils/apiError.js'
import { authMiddleware } from '../../../src/middlewares/auth.middleware.js'

describe('auth.middleware', () => {
    let req
    let res
    let next
    const OLD_ENV = process.env.NODE_ENV

    beforeEach(() => {
        vi.clearAllMocks()
        req = { headers: {} }
        res = {}
        next = vi.fn()
        process.env.NODE_ENV = 'test'
    })

    test('debería setear req.user con Bearer válido', () => {
        req.headers.authorization = 'Bearer token123'
        jwtUtil.verifyAccessToken.mockReturnValue({ id: 'u1', role: 'user', email: 'a@b.com' })
        authMiddleware(req, res, next)
        expect(jwtUtil.verifyAccessToken).toHaveBeenCalledWith('token123')
        expect(req.user).toEqual({ id: 'u1', role: 'user', email: 'a@b.com' })
        expect(next).toHaveBeenCalledWith()
    })

    test('debería lanzar 401 si falta header', () => {
        authMiddleware(req, res, next)
        expect(next).toHaveBeenCalled()
        const err = next.mock.calls[0][0]
        expect(err).toBeInstanceOf(ApiError)
        expect(err.statusCode).toBe(401)
    })

    test('debería normalizar mensaje a Unauthorized en producción cuando 401', () => {
        process.env.NODE_ENV = 'production'
        req.headers.authorization = 'Bearer bad'
        jwtUtil.verifyAccessToken.mockImplementation(() => { throw new ApiError(401, 'Invalid or expired access token') })
        authMiddleware(req, res, next)
        const err = next.mock.calls[0][0]
        expect(err).toBeInstanceOf(ApiError)
        expect(err.statusCode).toBe(401)
        expect(err.message).toBe('Unauthorized')
        process.env.NODE_ENV = OLD_ENV
    })

    test('debería propagar otros errores no 401', () => {
        req.headers.authorization = 'Bearer any'
        const boom = new Error('boom')
        jwtUtil.verifyAccessToken.mockImplementation(() => { throw boom })
        authMiddleware(req, res, next)
        expect(next).toHaveBeenCalledWith(boom)
    })
})
