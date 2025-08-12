import jwt from 'jsonwebtoken'
import { beforeEach, describe, expect, test, vi } from 'vitest'

vi.mock('jsonwebtoken', () => ({
    default: {
        sign: vi.fn(),
        verify: vi.fn()
    }
}))

vi.mock('../../../src/config/index.js', () => ({
    config: {
        jwt: {
            secret: 'access-secret',
            refreshSecret: 'refresh-secret',
            expires: '15m'
        }
    }
}))

import { config } from '../../../src/config/index.js'
import { tokenService } from '../../../src/services/token.service.js'
import { ApiError } from '../../../src/utils/apiError.js'

describe('token.service', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        config.jwt.secret = 'access-secret'
        config.jwt.refreshSecret = 'refresh-secret'
        config.jwt.expires = '15m'
    })

    test('debería firmar access token con secret y expires', () => {
        jwt.sign.mockReturnValue('access.token')
        const tok = tokenService.generateAccessToken({ id: 'u1' })
        expect(jwt.sign).toHaveBeenCalledWith({ id: 'u1' }, 'access-secret', { expiresIn: '15m' })
        expect(tok).toBe('access.token')
    })

    test('debería lanzar ApiError si falta access secret al generar', () => {
        config.jwt.secret = ''
        expect(() => tokenService.generateAccessToken({ id: 'u1' })).toThrow(ApiError)
    })

    test('debería firmar refresh token con refreshSecret y 7d', () => {
        jwt.sign.mockReturnValue('refresh.token')
        const tok = tokenService.generateRefreshToken({ id: 'u1' })
        expect(jwt.sign).toHaveBeenCalledWith({ id: 'u1' }, 'refresh-secret', { expiresIn: '7d' })
        expect(tok).toBe('refresh.token')
    })

    test('debería lanzar ApiError si falta refresh secret al generar', () => {
        config.jwt.refreshSecret = ''
        expect(() => tokenService.generateRefreshToken({ id: 'u1' })).toThrow(ApiError)
    })

    test('debería verificar access token con secret', () => {
        jwt.verify.mockReturnValue({ id: 'u1' })
        const res = tokenService.verifyAccessToken('access.token')
        expect(jwt.verify).toHaveBeenCalledWith('access.token', 'access-secret')
        expect(res).toEqual({ id: 'u1' })
    })

    test('debería lanzar ApiError si falta access secret al verificar', () => {
        config.jwt.secret = ''
        expect(() => tokenService.verifyAccessToken('x')).toThrow(ApiError)
    })

    test('debería verificar refresh token con refresh secret', () => {
        jwt.verify.mockReturnValue({ id: 'u1' })
        const res = tokenService.verifyRefreshToken('refresh.token')
        expect(jwt.verify).toHaveBeenCalledWith('refresh.token', 'refresh-secret')
        expect(res).toEqual({ id: 'u1' })
    })

    test('debería lanzar ApiError si falta refresh secret al verificar', () => {
        config.jwt.refreshSecret = ''
        expect(() => tokenService.verifyRefreshToken('x')).toThrow(ApiError)
    })
})
