import jwt from 'jsonwebtoken'
import { config } from '../config/index.js'
import { ApiError } from './apiError.js'

const pickId = (u) => (u && (u.id || u._id)) ? String(u.id || u._id) : ''

export const jwtUtil = {
    createAccessToken(user) {
        const secret = config.jwt?.secret || ''
        const expires = config.jwt?.expires || '15m'
        if (!secret) throw new ApiError(500, 'JWT secret is missing')
        const payload = { id: pickId(user), role: user?.role }
        return jwt.sign(payload, secret, { expiresIn: expires })
    },
    createRefreshToken(user) {
        const secret = config.jwt?.refreshSecret || ''
        if (!secret) throw new ApiError(500, 'JWT refresh secret is missing')
        const payload = { id: pickId(user) }
        return jwt.sign(payload, secret, { expiresIn: '7d' })
    },
    verifyAccessToken(token) {
        const secret = config.jwt?.secret || ''
        if (!secret) throw new ApiError(500, 'JWT secret is missing')
        try {
            return jwt.verify(token, secret)
        } catch {
            throw new ApiError(401, 'Invalid or expired access token')
        }
    },

    verifyRefreshToken(token) {
        const secret = config.jwt?.refreshSecret || ''
        if (!secret) throw new ApiError(500, 'JWT refresh secret is missing')
        try {
            return jwt.verify(token, secret)
        } catch {
            throw new ApiError(401, 'Invalid or expired refresh token')
        }
    }
}
