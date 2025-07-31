import { describe, test, expect, beforeEach, vi } from 'vitest'
import jwt from 'jsonwebtoken'

import { tokenService } from '../../../src/services/token.service.js'
import { config } from '../../../src/config/index.js'

vi.mock('jsonwebtoken')

describe('tokenService', () => {
    const payload = { id: 'abc123', role: 'user' }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    test('generateAccessToken should sign token with access secret', () => {
        jwt.sign.mockReturnValue('access.token')

        const token = tokenService.generateAccessToken(payload)

        expect(jwt.sign).toHaveBeenCalledWith(payload, config.jwt.secret, { expiresIn: config.jwt.expires || '15m' })
        expect(token).toBe('access.token')
    })

    test('generateRefreshToken should sign token with refresh secret', () => {
        jwt.sign.mockReturnValue('refresh.token')

        const token = tokenService.generateRefreshToken(payload)

        expect(jwt.sign).toHaveBeenCalledWith(payload, config.jwt.refreshSecret, { expiresIn: '7d' })
        expect(token).toBe('refresh.token')
    })

    test('verifyAccessToken should verify token with access secret', () => {
        jwt.verify.mockReturnValue({ id: 'abc123', role: 'user' })

        const result = tokenService.verifyAccessToken('access.token')

        expect(jwt.verify).toHaveBeenCalledWith('access.token', config.jwt.secret)
        expect(result).toEqual({ id: 'abc123', role: 'user' })
    })

    test('verifyRefreshToken should verify token with refresh secret', () => {
        jwt.verify.mockReturnValue({ id: 'abc123' })

        const result = tokenService.verifyRefreshToken('refresh.token')

        expect(jwt.verify).toHaveBeenCalledWith('refresh.token', config.jwt.refreshSecret)
        expect(result).toEqual({ id: 'abc123' })
    })
})
