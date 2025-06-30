import jwt from 'jsonwebtoken'
import config from '../config/index.js'
import ApiError from '../utils/apiError.js'

const generateAccessToken = (payload) => {
    if (!config.jwt.secret) throw new ApiError(500, 'JWT secret is missing')
    return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expires || '15m' })
}

const generateRefreshToken = (payload) => {
    if (!config.jwt.secret) throw new ApiError(500, 'JWT secret is missing')
    return jwt.sign(payload, config.jwt.secret, { expiresIn: '7d' })
}

const verifyAccessToken = (token) => {
    return jwt.verify(token, config.jwt.secret)
}

export default {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken
}