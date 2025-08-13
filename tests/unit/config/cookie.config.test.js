import { describe, expect, it } from 'vitest'
import { accessTokenCookieOptions, refreshTokenCookieOptions } from '../../../src/config/cookie.config.js'

describe('cookie.config', () => {
    it('debería exponer opciones seguras para access token', () => {
        expect(accessTokenCookieOptions).toMatchObject({ httpOnly: true, secure: true, sameSite: 'strict' })
        expect(typeof accessTokenCookieOptions.maxAge).toBe('number')
    })
    it('debería exponer opciones seguras para refresh token', () => {
        expect(refreshTokenCookieOptions).toMatchObject({ httpOnly: true, secure: true, sameSite: 'strict' })
        expect(typeof refreshTokenCookieOptions.maxAge).toBe('number')
    })
})
