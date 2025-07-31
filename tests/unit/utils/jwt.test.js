import { describe, test, expect, vi, beforeEach } from 'vitest'
import jwt from 'jsonwebtoken'

import { jwtUtil } from '../../../src/utils/jwt.util.js'
import { ApiError } from '../../../src/utils/apiError.js'
import { config } from '../../../src/config/index.js'

vi.mock('jsonwebtoken')

describe('jwtUtil', () => {
    const user = { _id: 'abc123', role: 'user' }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    test('createAccessToken should return signed token with access secret', () => {
        jwt.sign.mockReturnValue('access.token')

        const token = jwtUtil.createAccessToken(user)

        expect(jwt.sign).toHaveBeenCalledWith(
            { id: 'abc123', role: 'user' },
            config.jwt.secret,
            { expiresIn: '15m' }
        )
        expect(token).toBe('access.token')
    })

    test('createRefreshToken should return signed token with refresh secret', () => {
        jwt.sign.mockReturnValue('refresh.token')

        const token = jwtUtil.createRefreshToken(user)

        expect(jwt.sign).toHaveBeenCalledWith(
            { id: 'abc123' },
            config.jwt.refreshSecret,
            { expiresIn: '7d' }
        )
        expect(token).toBe('refresh.token')
    })

    test('verifyAccessToken should return decoded payload if valid', () => {
        jwt.verify.mockReturnValue({ id: 'abc123', role: 'user' })

        const result = jwtUtil.verifyAccessToken('token123')

        expect(jwt.verify).toHaveBeenCalledWith('token123', config.jwt.secret)
        expect(result).toEqual({ id: 'abc123', role: 'user' })
    })

    test('verifyAccessToken should throw ApiError if invalid', () => {
        jwt.verify.mockImplementation(() => { throw new Error('Invalid') })

        expect(() => jwtUtil.verifyAccessToken('badtoken')).toThrow(ApiError)
        expect(() => jwtUtil.verifyAccessToken('badtoken')).toThrow('Invalid or expired access token')
    })

    test('verifyRefreshToken should return decoded payload if valid', () => {
        jwt.verify.mockReturnValue({ id: 'abc123' })

        const result = jwtUtil.verifyRefreshToken('token456')

        expect(jwt.verify).toHaveBeenCalledWith('token456', config.jwt.refreshSecret)
        expect(result).toEqual({ id: 'abc123' })
    })

    test('verifyRefreshToken should throw ApiError if invalid', () => {
        jwt.verify.mockImplementation(() => { throw new Error('Invalid') })

        expect(() => jwtUtil.verifyRefreshToken('badtoken')).toThrow(ApiError)
        expect(() => jwtUtil.verifyRefreshToken('badtoken')).toThrow('Invalid or expired refresh token')
    })
})
