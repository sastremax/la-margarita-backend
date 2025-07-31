import { accessTokenCookieOptions, refreshTokenCookieOptions } from '../config/cookie.config.js'
import { handleRefresh } from '../services/refresh.service.js'

export const postRefresh = (req, res, next) => {
    try {
        const refreshToken = req.cookies?.refreshToken
        const { newAccessToken, newRefreshToken } = handleRefresh(refreshToken)

        res.cookie('token', newAccessToken, accessTokenCookieOptions)
        res.cookie('refreshToken', newRefreshToken, refreshTokenCookieOptions)

        res.status(200).json({ status: 'success', message: 'Token refreshed' })
    } catch (error) {
        next(error)
    }
}
