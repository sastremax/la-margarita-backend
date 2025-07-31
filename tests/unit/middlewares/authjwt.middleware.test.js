import { describe, test, expect, vi, beforeEach } from 'vitest'

const verifyAccessTokenMock = vi.fn()

vi.mock('../../../src/utils/jwt.util.js', () => ({
    jwtUtil: {
        verifyAccessToken: verifyAccessTokenMock
    }
}))

import { ApiError } from '../../../src/utils/apiError.js'

describe('authJWT middleware', () => {
    let authJWT
    let req, res, next

    beforeEach(async () => {
        verifyAccessTokenMock.mockReset()
        req = { cookies: {} }
        res = {}
        next = vi.fn()

        const module = await import('../../../src/middlewares/authjwt.middleware.js')
        authJWT = module.authJWT
    })

    test('should throw 401 if token is missing in cookies', () => {
        authJWT(req, res, next)

        const err = next.mock.calls[0][0]
        expect(err).toBeInstanceOf(ApiError)
        expect(err.statusCode).toBe(401)
        expect(err.message).toBe('Authentication token missing')
    })

    test('should attach user to req and call next if token is valid', () => {
        req.cookies.token = 'valid.token'
        const decoded = { id: 'user1', role: 'user' }
        verifyAccessTokenMock.mockReturnValue(decoded)

        authJWT(req, res, next)

        expect(req.user).toEqual(decoded)
        expect(next).toHaveBeenCalledWith()
    })

    test('should pass error to next if token verification fails', () => {
        req.cookies.token = 'invalid.token'
        const error = new Error('Invalid token')
        verifyAccessTokenMock.mockImplementation(() => { throw error })

        authJWT(req, res, next)

        const result = next.mock.calls[0][0]
        expect(result).toBe(error)
    })
})