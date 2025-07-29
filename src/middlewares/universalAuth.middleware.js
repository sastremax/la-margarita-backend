import { ApiError } from '../utils/apiError.js'
import { jwtUtil } from '../utils/jwt.util.js'

export const universalAuth = (req, res, next) => {
    let token = req.cookies?.token

    if (!token) {
        const authHeader = req.headers?.authorization
        if (authHeader?.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1]
        }
    }

    if (!token) {
        return next(new ApiError(401, 'Authentication token missing'))
    }

    const decoded = jwtUtil.verifyAccessToken(token)
    if (!decoded) {
        return next(new ApiError(401, 'Invalid or expired token'))
    }

    req.user = decoded
    next()
}
