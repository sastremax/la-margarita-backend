import { describe, test, expect, beforeEach } from 'vitest'
import { tokenStore } from '../../../src/utils/tokenStore.js'

describe('tokenStore', () => {
    const token = 'refresh-token-123'

    beforeEach(() => {
        tokenStore.removeRefreshToken(token)
    })

    test('isRefreshTokenValid should return false if token not stored', () => {
        expect(tokenStore.isRefreshTokenValid(token)).toBe(false)
    })

    test('saveRefreshToken should store token', () => {
        tokenStore.saveRefreshToken(token)
        expect(tokenStore.isRefreshTokenValid(token)).toBe(true)
    })

    test('removeRefreshToken should delete token', () => {
        tokenStore.saveRefreshToken(token)
        tokenStore.removeRefreshToken(token)
        expect(tokenStore.isRefreshTokenValid(token)).toBe(false)
    })
})
