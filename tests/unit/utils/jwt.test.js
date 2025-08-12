import jwt from 'jsonwebtoken'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { config } from '../../../src/config/index.js'
import { ApiError } from '../../../src/utils/apiError.js'
import { jwtUtil } from '../../../src/utils/jwt.util.js'

vi.mock('jsonwebtoken')

describe('jwtUtil', () => {
    const user = { _id: 'abc123', role: 'user' }

    beforeEach(() => {
        vi.clearAllMocks()
        config.jwt.secret = config.jwt.secret || 'access-secret'
        config.jwt.refreshSecret = config.jwt.refreshSecret || 'refresh-secret'
        config.jwt.expires = '15m'
    })

    test('createAccessToken debería firmar con access secret', () => {
        jwt.sign.mockReturnValue('access.token')
        const token = jwtUtil.createAccessToken(user)
        expect(jwt.sign).toHaveBeenCalledWith(
            { id: 'abc123', role: 'user' },
            config.jwt.secret,
            { expiresIn: '15m' }
        )
        expect(token).toBe('access.token')
    })

    test('createRefreshToken debería firmar con refresh secret', () => {
        jwt.sign.mockReturnValue('refresh.token')
        const token = jwtUtil.createRefreshToken(user)
        expect(jwt.sign).toHaveBeenCalledWith(
            { id: 'abc123' },
            config.jwt.refreshSecret,
            { expiresIn: '7d' }
        )
        expect(token).toBe('refresh.token')
    })

    test('verifyAccessToken debería devolver payload válido', () => {
        jwt.verify.mockReturnValue({ id: 'abc123', role: 'user' })
        const result = jwtUtil.verifyAccessToken('token123')
        expect(jwt.verify).toHaveBeenCalledWith('token123', config.jwt.secret)
        expect(result).toEqual({ id: 'abc123', role: 'user' })
    })

    test('verifyAccessToken debería lanzar ApiError si inválido', () => {
        jwt.verify.mockImplementation(() => { throw new Error('Invalid') })
        expect(() => jwtUtil.verifyAccessToken('badtoken')).toThrow(ApiError)
        expect(() => jwtUtil.verifyAccessToken('badtoken')).toThrow('Invalid or expired access token')
    })

    test('verifyRefreshToken debería devolver payload válido', () => {
        jwt.verify.mockReturnValue({ id: 'abc123' })
        const result = jwtUtil.verifyRefreshToken('token456')
        expect(jwt.verify).toHaveBeenCalledWith('token456', config.jwt.refreshSecret)
        expect(result).toEqual({ id: 'abc123' })
    })

    test('verifyRefreshToken debería lanzar ApiError si inválido', () => {
        jwt.verify.mockImplementation(() => { throw new Error('Invalid') })
        expect(() => jwtUtil.verifyRefreshToken('badtoken')).toThrow(ApiError)
        expect(() => jwtUtil.verifyRefreshToken('badtoken')).toThrow('Invalid or expired refresh token')
    })

    test('createAccessToken debería respetar config.jwt.expires si está definido', () => {
        config.jwt.expires = '30m'
        jwt.sign.mockReturnValue('access.token')
        jwtUtil.createAccessToken(user)
        expect(jwt.sign).toHaveBeenCalledWith(
            { id: 'abc123', role: 'user' },
            config.jwt.secret,
            { expiresIn: '30m' }
        )
    })

    test('createAccessToken debería tolerar user.id cuando no hay _id', () => {
        const u = { id: 'u1', role: 'admin' }
        jwt.sign.mockReturnValue('access.token')
        jwtUtil.createAccessToken(u)
        expect(jwt.sign).toHaveBeenCalledWith(
            { id: 'u1', role: 'admin' },
            config.jwt.secret,
            { expiresIn: '15m' }
        )
    })

    test('createAccessToken debería lanzar 500 si falta secret', () => {
        const old = config.jwt.secret
        config.jwt.secret = ''
        expect(() => jwtUtil.createAccessToken(user)).toThrow(ApiError)
        expect(() => jwtUtil.createAccessToken(user)).toThrow('JWT secret is missing')
        config.jwt.secret = old
    })

    test('createRefreshToken debería lanzar 500 si falta refreshSecret', () => {
        const old = config.jwt.refreshSecret
        config.jwt.refreshSecret = ''
        expect(() => jwtUtil.createRefreshToken(user)).toThrow(ApiError)
        expect(() => jwtUtil.createRefreshToken(user)).toThrow('JWT refresh secret is missing')
        config.jwt.refreshSecret = old
    })

    test('verifyAccessToken debería lanzar 500 si falta secret', () => {
        const old = config.jwt.secret
        config.jwt.secret = ''
        expect(() => jwtUtil.verifyAccessToken('x')).toThrow(ApiError)
        expect(() => jwtUtil.verifyAccessToken('x')).toThrow('JWT secret is missing')
        config.jwt.secret = old
    })

    test('verifyRefreshToken debería lanzar 500 si falta refreshSecret', () => {
        const old = config.jwt.refreshSecret
        config.jwt.refreshSecret = ''
        expect(() => jwtUtil.verifyRefreshToken('x')).toThrow(ApiError)
        expect(() => jwtUtil.verifyRefreshToken('x')).toThrow('JWT refresh secret is missing')
        config.jwt.refreshSecret = old
    })
})
