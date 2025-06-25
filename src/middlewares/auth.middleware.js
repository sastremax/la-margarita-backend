import jwtUtil from '../utils/jwt.util.js'
import ApiError from '../utils/apiError.js'

const isProduction = process.env.NODE_ENV === 'production'

function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || authHeader.indexOf('Bearer ') !== 0) {
            throw new ApiError(401, 'No token provided')
        }

        const token = authHeader.split(' ')[1]
        if (!token) {
            throw new ApiError(401, 'No token provided')
        }

        const decoded = jwtUtil.verifyToken(token)
        req.user = decoded
        next()
    } catch (error) {
        if (isProduction && error instanceof ApiError && error.status === 401) {
            return next(new ApiError(401, 'Unauthorized'))
        }
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return next(new ApiError(401, isProduction ? 'Unauthorized' : error.message))
        }
        next(error)
    }
}

export default authMiddleware