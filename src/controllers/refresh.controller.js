import jwtUtil from '../utils/jwt.util.js'
import tokenService from '../services/token.service.js'
import cookieConfig from '../config/cookie.config.js'
import ApiError from '../utils/apiError.js'

const postRefresh = async (req, res, next) => {
    try {
        const refreshToken = req.cookies?.refreshToken
        if (!refreshToken) {
            return next(new ApiError(401, 'Refresh token missing'))
        }

        const decoded = jwtUtil.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET)
        const newAccessToken = tokenService.generateAccessToken({ id: decoded.id, role: decoded.role })

        res.cookie('token', newAccessToken, cookieConfig.accessTokenCookieOptions)

        res.status(200).json({ status: 'success', message: 'Token refreshed' })
    } catch (error) {
        next(error)
    }
}

export default {
    postRefresh
}