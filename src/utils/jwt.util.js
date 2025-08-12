import jwt from 'jsonwebtoken'
import { config } from '../config/index.js'
import { ApiError } from './apiError.js'

const getUserId = (u) => u?._id?.toString?.() || u?.id || null

const requireAccessSecret = () => {
    if (!config?.jwt?.secret) throw new ApiError(500, 'JWT secret is missing')
}

const requireRefreshSecret = () => {
    if (!config?.jwt?.refreshSecret) throw new ApiError(500, 'JWT refresh secret is missing')
}

const createAccessToken = (user, expiresIn) => {
    requireAccessSecret()
    const payload = { id: getUserId(user), role: user.role }
    const exp = expiresIn || config?.jwt?.expires || '15m'
    return jwt.sign(payload, config.jwt.secret, { expiresIn: exp })
}

const createRefreshToken = (user, expiresIn) => {
    requireRefreshSecret()
    const payload = { id: getUserId(user) }
    const exp = expiresIn || '7d'
    return jwt.sign(payload, config.jwt.refreshSecret, { expiresIn: exp })
}

const verifyAccessToken = (token) => {
    requireAccessSecret()
    try {
        return jwt.verify(token, config.jwt.secret)
    } catch {
        throw new ApiError(401, 'Invalid or expired access token')
    }
}

const verifyRefreshToken = (token) => {
    requireRefreshSecret()
    try {
        return jwt.verify(token, config.jwt.refreshSecret)
    } catch {
        throw new ApiError(401, 'Invalid or expired refresh token')
    }
}

export const jwtUtil = {
    createAccessToken,
    createRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
}
