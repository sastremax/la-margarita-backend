import jwt from 'jsonwebtoken'
import { config } from '../config/index.js'
import { ApiError } from './apiError.js'

const createAccessToken = (user, expiresIn = '15m') => {
    const payload = {
        id: user._id,
        role: user.role
    }

    return jwt.sign(payload, config.jwt.secret, { expiresIn })
}

const createRefreshToken = (user, expiresIn = '7d') => {
    const payload = { id: user._id }

    return jwt.sign(payload, config.jwt.refreshSecret, { expiresIn })
}

const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, config.jwt.secret)
    } catch {
        throw new ApiError(401, 'Invalid or expired access token')
    }
}

const verifyRefreshToken = (token) => {
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
