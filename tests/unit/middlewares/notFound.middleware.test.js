import { describe, expect, it, vi } from 'vitest'
import { notFound } from '../../../src/middlewares/notFound.middleware.js'
import { ApiError } from '../../../src/utils/apiError.js'

describe('notFound.middleware', () => {
    it('debería propagar ApiError 404 con la ruta', () => {
        const req = { originalUrl: '/x' }
        const next = vi.fn()
        notFound(req, {}, next)
        const err = next.mock.calls[0][0]
        expect(err).toBeInstanceOf(ApiError)
        expect(err.statusCode).toBe(404)
        expect(err.message).toContain('/x')
    })
})
