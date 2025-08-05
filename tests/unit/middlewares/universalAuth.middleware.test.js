import { beforeEach, describe, expect, test, vi } from 'vitest'
import { ApiError } from '../../../src/utils/apiError.js'

let jwtUtil
let universalAuth

vi.mock('../../../src/utils/jwt.util.js', async () => {
    const actual = await vi.importActual('../../../src/utils/jwt.util.js')
    return {
        jwtUtil: {
            ...actual.jwtUtil,
            verifyAccessToken: vi.fn()
        }
    }
})

beforeEach(async () => {
    vi.clearAllMocks()
    const mod = await import('../../../src/middlewares/universalAuth.middleware.js')
    universalAuth = mod.universalAuth
    jwtUtil = (await import('../../../src/utils/jwt.util.js')).jwtUtil
})

describe('universalAuth middleware', () => {
    test('should extract token from cookies and decode it', () => {
        const req = {
            cookies: { token: 'abc.def.ghi' },
            headers: {}
        }
        const res = {}
        const next = vi.fn()

        jwtUtil.verifyAccessToken.mockReturnValue({ id: 'user1', role: 'user' })

        universalAuth(req, res, next)

        expect(jwtUtil.verifyAccessToken).toHaveBeenCalledWith('abc.def.ghi')
        expect(req.user).toEqual({ id: 'user1', role: 'user' })
        expect(next).toHaveBeenCalledWith()
    })

    test('should extract token from Authorization header if not in cookies', () => {
        const req = {
            cookies: {},
            headers: {
                authorization: 'Bearer xyz.123.token'
            }
        }
        const res = {}
        const next = vi.fn()

        jwtUtil.verifyAccessToken.mockReturnValue({ id: 'admin1', role: 'admin' })

        universalAuth(req, res, next)

        expect(jwtUtil.verifyAccessToken).toHaveBeenCalledWith('xyz.123.token')
        expect(req.user).toEqual({ id: 'admin1', role: 'admin' })
        expect(next).toHaveBeenCalledWith()
    })

    test('should return 401 if no token is present', () => {
        const req = {
            cookies: {},
            headers: {}
        }
        const res = {}
        const next = vi.fn()

        universalAuth(req, res, next)

        expect(next).toHaveBeenCalledWith(expect.any(ApiError))
        const err = next.mock.calls[0][0]
        expect(err).toBeInstanceOf(ApiError)
        expect(err.statusCode).toBe(401)
        expect(err.message).toBe('Authentication token missing')
    })

    test('should return 401 if token is invalid or expired', () => {
        const req = {
            cookies: { token: 'invalid.token' },
            headers: {}
        }
        const res = {}
        const next = vi.fn()

        jwtUtil.verifyAccessToken.mockImplementation(() => {
            throw new Error('Token expired')
        })

        universalAuth(req, res, next)

        expect(next).toHaveBeenCalledWith(expect.any(ApiError))
        const err = next.mock.calls[0][0]
        expect(err).toBeInstanceOf(ApiError)
        expect(err.statusCode).toBe(401)
        expect(err.message).toBe('Invalid or expired token')
    })
})