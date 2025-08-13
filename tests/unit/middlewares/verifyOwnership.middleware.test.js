import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '../../../src/utils/apiError.js'
import { verifyOwnership } from '../../../src/middlewares/verifyOwnership.js'

describe('verifyOwnership', () => {
    let req, res, next, getOwner

    beforeEach(() => {
        req = { user: { id: 'u1' }, params: {} }
        res = {}
        next = vi.fn()
        getOwner = vi.fn(async () => 'u1')
    })

    it('debería permitir si el requester es el owner', async () => {
        const mw = verifyOwnership(getOwner)
        await mw(req, res, next)
        expect(getOwner).toHaveBeenCalledWith(req)
        expect(next).toHaveBeenCalledWith()
    })

    it('debería rechazar con 403 si no es owner', async () => {
        getOwner.mockResolvedValue('u2')
        const mw = verifyOwnership(getOwner)
        await mw(req, res, next)
        const err = next.mock.calls[0][0]
        expect(err).toBeInstanceOf(ApiError)
        expect(err.statusCode).toBe(403)
    })

    it('debería rechazar con 403 si falta requester o owner', async () => {
        req.user = null
        getOwner.mockResolvedValue(null)
        const mw = verifyOwnership(getOwner)
        await mw(req, res, next)
        const err = next.mock.calls[0][0]
        expect(err).toBeInstanceOf(ApiError)
        expect(err.statusCode).toBe(403)
    })
})
