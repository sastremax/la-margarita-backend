import { tokenService } from './token.service.js'
import { tokenStore } from '../utils/tokenStore.js'
import { ApiError } from '../utils/apiError.js'

export const refreshService = {
    rotateRefreshToken: (refreshToken) => {
        if (!refreshToken) throw new ApiError(401, 'Refresh token missing')

        const isValid = tokenStore.isRefreshTokenValid(refreshToken)
        if (!isValid) throw new ApiError(403, 'Refresh token is invalid or expired')

        const decoded = tokenService.verifyRefreshToken(refreshToken)

        tokenStore.removeRefreshToken(refreshToken)

        const newAccessToken = tokenService.generateAccessToken({ id: decoded.id, role: decoded.role })
        const newRefreshToken = tokenService.generateRefreshToken({ id: decoded.id })

        tokenStore.saveRefreshToken(newRefreshToken)

        return { newAccessToken, newRefreshToken }
    }
}
