import jwtUtil from '../utils/jwt.util.js'

const generateAccessToken = (payload) => {
    return jwtUtil.createAccessToken(payload)
}

export default {
    generateAccessToken
}