import { ApiError } from '../utils/apiError.js'
import { jwtUtil } from '../utils/jwt.util.js'

export const authJWT = (req, res, next) => {
    const token = req.cookies?.token

    if (!token) {
        return next(new ApiError(401, 'Authentication token missing'))
    }

    try {
        const decoded = jwtUtil.verifyAccessToken(token)
        req.user = decoded
        next()
    } catch (error) {
        next(error)
    }
}
