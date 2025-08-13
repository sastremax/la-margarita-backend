import { beforeEach, describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { validateDTO } from '../../../src/middlewares/validateDTO.middleware.js'

describe('validateDTO.middleware', () => {
    let res, next
    const okSchema = z.object({ a: z.string().min(1) })

    beforeEach(() => {
        res = { status: vi.fn().mockReturnThis(), json: vi.fn() }
        next = vi.fn()
    })

    it('debería validar body correcto y asignar data', () => {
        const req = { body: { a: 'x' } }
        const mw = validateDTO(okSchema, 'body')
        mw(req, res, next)
        expect(req.body).toEqual({ a: 'x' })
        expect(next).toHaveBeenCalledWith()
    })

    it('debería responder 400 si body inválido', () => {
        const req = { body: { a: '' } }
        const mw = validateDTO(okSchema, 'body')
        mw(req, res, next)
        expect(res.status).toHaveBeenCalledWith(400)
        const payload = res.json.mock.calls[0][0]
        expect(payload.status).toBe('error')
        expect(Array.isArray(payload.errors)).toBe(true)
    })

    it('debería validar query y reasignar en req.query', () => {
        const schema = z.object({ page: z.coerce.number().int().positive() })
        const req = { query: { page: '2' } }
        const mw = validateDTO(schema, 'query')
        mw(req, res, next)
        expect(req.query).toEqual({ page: 2 })
        expect(next).toHaveBeenCalledWith()
    })
})
