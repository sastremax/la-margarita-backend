import { jwtUtil } from '../utils/jwt.util.js'

const generateAccessToken = (subject) => jwtUtil.createAccessToken(subject)
const generateRefreshToken = (subject) => jwtUtil.createRefreshToken(subject)
const verifyAccessToken = (token) => jwtUtil.verifyAccessToken(token)
const verifyRefreshToken = (token) => jwtUtil.verifyRefreshToken(token)

export const tokenService = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
}
