import jwt from 'jsonwebtoken'
import config from '../config/index.js'
import ApiError from './apiError.js'

function createToken(payload, expiresIn = config.jwtExpiresIn) {
    return jwt.sign(payload, config.jwtSecret, { expiresIn })
}

function verifyToken(token) {
    try {
        return jwt.verify(token, config.jwtSecret)
    } catch {
        throw new ApiError(401, 'Invalid or expired token')
    }
}

export default {
    createToken,
    verifyToken
}
