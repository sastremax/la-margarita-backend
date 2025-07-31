import { accessTokenCookieOptions, refreshTokenCookieOptions } from '../config/cookie.config.js'
import { ApiError } from '../utils/apiError.js'

import { tokenService } from '../services/token.service.js'
import { tokenStore } from '../utils/tokenStore.js'


export const postRefresh = async (req, res, next) => {
    try {
        const refreshToken = req.cookies?.refreshToken
        if (!refreshToken) {
            return next(new ApiError(401, 'Refresh token missing'))
        }

        const isValid = tokenStore.isRefreshTokenValid(refreshToken)
        if (!isValid) {
            return next(new ApiError(403, 'Refresh token is invalid or expired'))
        }

        const decoded = tokenService.verifyRefreshToken(refreshToken)

        tokenStore.removeRefreshToken(refreshToken)

        const newAccessToken = tokenService.generateAccessToken({ id: decoded.id, role: decoded.role })
        const newRefreshToken = tokenService.generateRefreshToken({ id: decoded.id })

        tokenStore.saveRefreshToken(newRefreshToken)

        res.cookie('token', newAccessToken, accessTokenCookieOptions)
        res.cookie('refreshToken', newRefreshToken, refreshTokenCookieOptions)

        res.status(200).json({ status: 'success', message: 'Token refreshed' })
    } catch (error) {
        next(error)
    }
}
