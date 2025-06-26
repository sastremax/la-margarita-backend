import jwt from 'jsonwebtoken'
import config from '../config/index.js'
import ApiError from './apiError.js'

const createAccessToken = (user) => {
    const payload = {
        id: user._id,
        role: user.role
    }

    return jwt.sign(payload, config.jwtSecret, {
        expiresIn: '15m'
    })
}

const createRefreshToken = (user) => {
    const payload = {
        id: user._id
    }

    return jwt.sign(payload, config.jwtRefreshSecret, {
        expiresIn: '7d'
    })
}

const verifyToken = (token, secret = config.jwtSecret) => {
    try {
        return jwt.verify(token, secret)
    } catch {
        throw new ApiError(401, 'Invalid or expired token')
    }
}

export default {
    createAccessToken,
    createRefreshToken,
    verifyToken
}
