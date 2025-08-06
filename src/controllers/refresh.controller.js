import { accessTokenCookieOptions, refreshTokenCookieOptions } from '../config/cookie.config.js'
import { refreshService } from '../services/refresh.service.js'
import { ApiError } from '../utils/apiError.js'

export const postRefresh = (req, res, next) => {
    try {
        const { refreshToken } = req.cookies || {}

        if (!refreshToken) {
            throw new ApiError(401, 'Refresh token missing')
        }

        const { newAccessToken, newRefreshToken } = refreshService.rotateRefreshToken(refreshToken)

        res.cookie('token', newAccessToken, accessTokenCookieOptions)
        res.cookie('refreshToken', newRefreshToken, refreshTokenCookieOptions)

        res.status(200).json({ status: 'success', message: 'Token refreshed' })
    } catch (error) {
        next(error)
    }
}
