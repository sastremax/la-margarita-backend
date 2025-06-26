import jwtUtil from '../utils/jwt.util.js'

const generateAccessToken = (payload, expiresIn = '15m') => {
    return jwtUtil.createAccessToken(payload, expiresIn)
}

const generateRefreshToken = (payload, expiresIn = '7d') => {
    return jwtUtil.createRefreshToken(payload, expiresIn)
}

const verifyAccessToken = (token) => {
    return jwtUtil.verifyAccessToken(token)
}

export default {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken
}