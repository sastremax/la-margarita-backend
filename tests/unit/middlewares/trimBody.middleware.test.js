import { describe, expect, it, vi } from 'vitest'
import { trimBody } from '../../../src/middlewares/trimBody.middleware.js'

describe('trimBody.middleware', () => {
    it('debería recortar strings de primer nivel y preservar tipos', () => {
        const req = { body: { a: ' x ', b: 1, c: { d: ' y ' } } }
        const res = {}
        const next = vi.fn()
        trimBody(req, res, next)
        expect(req.body).toEqual({ a: 'x', b: 1, c: { d: ' y ' } })
        expect(next).toHaveBeenCalled()
    })
})
