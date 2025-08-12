import express from 'express'
import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../../src/services/cart.service.js', () => {
    return {
        cartService: {
            getCartById: vi.fn(async (id) => {
                if (id === '507f1f77bcf86cd799439011') {
                    return { id, userId: '507f1f77bcf86cd799439011' }
                }
                return null
            })
        }
    }
})

describe('validateCartExists middleware', () => {
    let app
    let mw

    beforeEach(async () => {
        vi.resetModules()
        const mod = await import('../../../src/middlewares/validateCartExists.js')
        mw = mod.validateCartExists
        app = express()
        app.use(express.json())
        app.get('/by-cid/:cid', mw, (req, res) => {
            res.status(200).json({ ok: true, cart: req.cart })
        })
        app.get('/by-id/:id', mw, (req, res) => {
            res.status(200).json({ ok: true, cart: req.cart })
        })
    })

    it('debería devolver 404 si el carrito no existe', async () => {
        const res = await request(app).get('/by-cid/507f1f77bcf86cd799439099')
        expect(res.status).toBe(404)
    })

    it('debería adjuntar req.cart cuando se usa :cid', async () => {
        const res = await request(app).get('/by-cid/507f1f77bcf86cd799439011')
        expect(res.status).toBe(200)
        expect(res.body.cart).toBeTruthy()
        expect(res.body.cart.userId).toBe('507f1f77bcf86cd799439011')
    })

    it('debería adjuntar req.cart cuando se usa :id', async () => {
        const res = await request(app).get('/by-id/507f1f77bcf86cd799439011')
        expect(res.status).toBe(200)
        expect(res.body.cart).toBeTruthy()
        expect(res.body.cart.userId).toBe('507f1f77bcf86cd799439011')
    })
})
