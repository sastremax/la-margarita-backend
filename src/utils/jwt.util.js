import jwt from 'jsonwebtoken'
import config from '../config/index.js'
import ApiError from './apiError.js'

const createAccessToken = (user, expiresIn = '15m') => {
    const payload = {
        id: user._id,
        role: user.role
    }

    return jwt.sign(payload, config.jwtSecret, { expiresIn })
}

const createRefreshToken = (user, expiresIn = '7d') => {
    const payload = { id: user._id }

    return jwt.sign(payload, config.jwtRefreshSecret, { expiresIn })
}

const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, config.jwtSecret)
    } catch {
        throw new ApiError(401, 'Invalid or expired access token')
    }
}

const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, config.jwtRefreshSecret)
    } catch {
        throw new ApiError(401, 'Invalid or expired refresh token')
    }
}

export default {
    createAccessToken,
    createRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
}