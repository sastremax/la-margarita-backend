import { describe, test, expect, vi, beforeEach } from 'vitest'
import { refreshService } from '../../../src/services/refresh.service.js'
import { tokenStore } from '../../../src/utils/tokenStore.js'
import { tokenService } from '../../../src/services/token.service.js'

vi.mock('../../../src/utils/tokenStore.js', () => ({
    tokenStore: {
        isRefreshTokenValid: vi.fn(),
        removeRefreshToken: vi.fn(),
        saveRefreshToken: vi.fn()
    }
}))

vi.mock('../../../src/services/token.service.js', () => ({
    tokenService: {
        verifyRefreshToken: vi.fn(),
        generateAccessToken: vi.fn(),
        generateRefreshToken: vi.fn()
    }
}))

describe('refreshService', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    test('should throw error if refresh token is missing', () => {
        expect(() => refreshService.rotateRefreshToken(undefined)).toThrowError('Refresh token missing')
    })

    test('should throw error if token is invalid or expired', () => {
        tokenStore.isRefreshTokenValid.mockReturnValue(false)

        expect(() => refreshService.rotateRefreshToken('fakeToken')).toThrowError('Refresh token is invalid or expired')
    })

    test('should return new access and refresh tokens if valid', () => {
        const oldToken = 'validRefreshToken'
        const decoded = { id: 'u1', role: 'user' }
        const accessToken = 'newAccess'
        const refreshToken = 'newRefresh'

        tokenStore.isRefreshTokenValid.mockReturnValue(true)
        tokenService.verifyRefreshToken.mockReturnValue(decoded)
        tokenService.generateAccessToken.mockReturnValue(accessToken)
        tokenService.generateRefreshToken.mockReturnValue(refreshToken)

        const result = refreshService.rotateRefreshToken(oldToken)

        expect(tokenStore.isRefreshTokenValid).toHaveBeenCalledWith(oldToken)
        expect(tokenService.verifyRefreshToken).toHaveBeenCalledWith(oldToken)
        expect(tokenStore.removeRefreshToken).toHaveBeenCalledWith(oldToken)
        expect(tokenStore.saveRefreshToken).toHaveBeenCalledWith(refreshToken)
        expect(result).toEqual({ newAccessToken: accessToken, newRefreshToken: refreshToken })
    })
})
