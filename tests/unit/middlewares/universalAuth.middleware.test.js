import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../../src/utils/jwt.util.js', () => ({
    jwtUtil: { verifyAccessToken: vi.fn() }
}))

import { jwtUtil } from '../../../src/utils/jwt.util.js'
import { ApiError } from '../../../src/utils/apiError.js'
import { universalAuth } from '../../../src/middlewares/universalAuth.middleware.js'

describe('universalAuth.middleware', () => {
    let req, res, next

    beforeEach(() => {
        vi.clearAllMocks()
        req = { cookies: {}, headers: {} }
        res = {}
        next = vi.fn()
    })

    it('debería autenticar con cookie token', () => {
        req.cookies.token = 't1'
        jwtUtil.verifyAccessToken.mockReturnValue({ id: 'u1', role: 'user' })
        universalAuth(req, res, next)
        expect(jwtUtil.verifyAccessToken).toHaveBeenCalledWith('t1')
        expect(req.user).toEqual({ id: 'u1', role: 'user' })
        expect(next).toHaveBeenCalledWith()
    })

    it('debería autenticar con Authorization Bearer', () => {
        req.headers.authorization = 'Bearer abc'
        jwtUtil.verifyAccessToken.mockReturnValue({ id: 'u2', role: 'admin' })
        universalAuth(req, res, next)
        expect(jwtUtil.verifyAccessToken).toHaveBeenCalledWith('abc')
        expect(req.user).toEqual({ id: 'u2', role: 'admin' })
        expect(next).toHaveBeenCalledWith()
    })

    it('debería responder 401 si falta token', () => {
        universalAuth(req, res, next)
        const err = next.mock.calls[0][0]
        expect(err).toBeInstanceOf(ApiError)
        expect(err.statusCode).toBe(401)
        expect(err.message).toBe('Authentication token missing')
    })

    it('debería propagar ApiError 401 de verificación', () => {
        req.cookies.token = 'bad'
        const e = new ApiError(401, 'Invalid or expired access token')
        jwtUtil.verifyAccessToken.mockImplementation(() => { throw e })
        universalAuth(req, res, next)
        expect(next).toHaveBeenCalledWith(e)
    })

    it('debería propagar errores no ApiError', () => {
        req.cookies.token = 'bad'
        const e = new Error('boom')
        jwtUtil.verifyAccessToken.mockImplementation(() => { throw e })
        universalAuth(req, res, next)
        expect(next).toHaveBeenCalledWith(e)
    })
})
