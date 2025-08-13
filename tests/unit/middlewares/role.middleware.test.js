import { beforeEach, describe, expect, it, vi } from 'vitest'
import { authorizeRoles } from '../../../src/middlewares/role.middleware.js'
import { ApiError } from '../../../src/utils/apiError.js'

describe('role.middleware', () => {
    let req, res, next
    beforeEach(() => {
        req = { user: { role: 'user' } }
        res = {}
        next = vi.fn()
    })

    it('debería permitir si el rol está autorizado', () => {
        const mw = authorizeRoles('user', 'admin')
        mw(req, res, next)
        expect(next).toHaveBeenCalledWith()
    })

    it('debería rechazar con 403 si no hay user', () => {
        req.user = null
        const mw = authorizeRoles('admin')
        mw(req, res, next)
        const err = next.mock.calls[0][0]
        expect(err).toBeInstanceOf(ApiError)
        expect(err.statusCode).toBe(403)
    })

    it('debería rechazar con 403 si el rol no coincide', () => {
        const mw = authorizeRoles('admin')
        mw(req, res, next)
        const err = next.mock.calls[0][0]
        expect(err).toBeInstanceOf(ApiError)
        expect(err.statusCode).toBe(403)
    })
})
