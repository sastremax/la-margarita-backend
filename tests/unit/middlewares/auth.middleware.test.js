import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

const verifyAccessTokenMock = vi.fn()

vi.mock('../../../src/utils/jwt.util.js', () => ({
    jwtUtil: {
        verifyAccessToken: verifyAccessTokenMock
    }
}))

describe('authMiddleware', () => {
    let authMiddleware
    const next = vi.fn()
    const res = {}
    let req
    let originalEnv

    beforeEach(async () => {
        vi.resetModules()
        verifyAccessTokenMock.mockReset()
        req = { headers: {} }
        next.mockClear()

        originalEnv = process.env.NODE_ENV
        const module = await import('../../../src/middlewares/auth.middleware.js')
        authMiddleware = module.authMiddleware
    })

    afterEach(() => {
        process.env.NODE_ENV = originalEnv
    })

    test('should throw 401 if no Authorization header', () => {
        authMiddleware(req, res, next)
        const err = next.mock.calls[0][0]
        expect(err.statusCode).toBe(401)
        expect(err.message).toBe('No token provided')
    })

    test('should throw 401 if Authorization header does not start with Bearer', () => {
        req.headers.authorization = 'Token xyz'
        authMiddleware(req, res, next)
        const err = next.mock.calls[0][0]
        expect(err.statusCode).toBe(401)
        expect(err.message).toBe('No token provided')
    })

    test('should attach user to req and call next if token valid', () => {
        req.headers.authorization = 'Bearer abc'
        const decoded = { id: 'u1', role: 'user' }
        verifyAccessTokenMock.mockReturnValue(decoded)
        authMiddleware(req, res, next)
        expect(req.user).toEqual(decoded)
        expect(next).toHaveBeenCalledWith()
    })

    test('should handle TokenExpiredError in non-production', () => {
        process.env.NODE_ENV = 'dev'
        req.headers.authorization = 'Bearer expired'
        const err = new Error('jwt expired')
        err.name = 'TokenExpiredError'
        verifyAccessTokenMock.mockImplementation(() => { throw err })
        authMiddleware(req, res, next)
        const result = next.mock.calls[0][0]
        expect(result.statusCode).toBe(401)
        expect(result.message).toBe('jwt expired')
    })

    test('should handle ApiError in production with generic message', async () => {
        process.env.NODE_ENV = 'production'
        req.headers.authorization = 'Bearer invalid'

        const { ApiError } = await import('../../../src/utils/apiError.js')
        const err = new ApiError(401, 'Specific reason')
        verifyAccessTokenMock.mockImplementation(() => { throw err })

        const module = await import('../../../src/middlewares/auth.middleware.js')
        const authMiddleware = module.authMiddleware

        authMiddleware(req, res, next)

        const result = next.mock.calls[0][0]
        expect(result.statusCode).toBe(401)
        expect(result.message).toBe('Unauthorized')
    })

    test('should pass unexpected error through', () => {
        req.headers.authorization = 'Bearer token'
        const err = new Error('Unexpected')
        verifyAccessTokenMock.mockImplementation(() => { throw err })
        authMiddleware(req, res, next)
        const result = next.mock.calls[0][0]
        expect(result.message).toBe('Unexpected')
    })
})
