import jwtUtil from '../utils/jwt.util.js'

export default function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
        const err = new Error('No token provided')
        err.statusCode = 401
        throw err
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwtUtil.verifyToken(token)
    req.user = decoded
    next()
}

