import jwtUtil from '../utils/jwt.util.js'
import ApiError from '../utils/apiError.js'

export default function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader?.startsWith('Bearer ')) {
            throw new ApiError(401, 'No token provided')
        }

        const token = authHeader.split(' ')[1]
        const decoded = jwtUtil.verifyToken(token)

        if (!decoded) {
            throw new ApiError(401, 'Invalid token')
        }

        req.user = decoded
        next()
    } catch (error) {
        next(error)
    }
}
