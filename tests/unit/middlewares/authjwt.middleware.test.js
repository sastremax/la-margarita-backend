import { beforeEach, describe, expect, test, vi } from 'vitest'
vi.mock('../../../src/utils/jwt.util.js', () => ({
    jwtUtil: { verifyAccessToken: vi.fn() }
}))
import { jwtUtil } from '../../../src/utils/jwt.util.js'
import { ApiError } from '../../../src/utils/apiError.js'
import { authJWT } from '../../../src/middlewares/authjwt.middleware.js'

describe('authjwt.middleware', () => {
    let req
    let res
    let next

    beforeEach(() => {
        vi.clearAllMocks()
        req = { cookies: {} }
        res = {}
        next = vi.fn()
    })

    test('debería autenticar con cookie token', () => {
        req.cookies.token = 'abc'
        jwtUtil.verifyAccessToken.mockReturnValue({ id: 'u1', role: 'user' })
        authJWT(req, res, next)
        expect(jwtUtil.verifyAccessToken).toHaveBeenCalledWith('abc')
        expect(req.user).toEqual({ id: 'u1', role: 'user' })
        expect(next).toHaveBeenCalledWith()
    })

    test('debería 401 si falta cookie token', () => {
        authJWT(req, res, next)
        const err = next.mock.calls[0][0]
        expect(err).toBeInstanceOf(ApiError)
        expect(err.statusCode).toBe(401)
    })

    test('debería pasar error de verificación', () => {
        req.cookies.token = 'bad'
        const err = new ApiError(401, 'Invalid or expired access token')
        jwtUtil.verifyAccessToken.mockImplementation(() => { throw err })
        authJWT(req, res, next)
        expect(next).toHaveBeenCalledWith(err)
    })
})
