import express from 'express'
import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('passport', () => {
    return {
        default: {
            authenticate: vi.fn(() => {
                return (req, res, next) => {
                    const role = req.headers['x-test-role']
                    const uid = req.headers['x-test-user-id']
                    if (role && uid) req.user = { id: uid, role }
                    else if (role) req.user = { id: 'u1', role }
                    next()
                }
            })
        }
    }
})

vi.mock('../../../src/middlewares/validateCartExists.js', () => ({
    validateCartExists: (req, res, next) => {
        const cid = req.params.cid || req.params.id
        const owner = req.headers['x-test-cart-owner'] || '507f1f77bcf86cd799439011'
        req.cart = { id: cid, userId: owner }
        next()
    }
}))

vi.mock('../../../src/controllers/cart.controller.js', () => ({
    getCartById: (req, res) => res.status(200).json({ route: 'getCartById', id: req.params.id }),
    createCart: (req, res) => res.status(201).json({ route: 'createCart' }),
    addProductToCart: (req, res) => res.status(200).json({ route: 'addProductToCart', cid: req.params.cid, pid: req.params.pid }),
    removeProductFromCart: (req, res) => res.status(200).json({ route: 'removeProductFromCart', cid: req.params.cid, pid: req.params.pid }),
    updateCartProducts: (req, res) => res.status(200).json({ route: 'updateCartProducts', cid: req.params.cid }),
    updateProductQuantity: (req, res) => res.status(200).json({ route: 'updateProductQuantity', cid: req.params.cid, pid: req.params.pid }),
    deleteCart: (req, res) => res.status(204).end(),
    purchaseCart: (req, res) => res.status(200).json({ route: 'purchaseCart', cid: req.params.cid })
}))

const errorHandler = (err, req, res, next) => {
    const status = err?.statusCode || 500
    res.status(status).json({ status: 'error', message: err?.message || 'error' })
}

describe('cart.router', () => {
    let app

    beforeEach(async () => {
        vi.resetModules()
        const mod = await import('../../../src/routes/cart.router.js')
        const { cartRouter } = mod
        app = express()
        app.use(express.json())
        app.use('/carts', cartRouter)
        app.use(errorHandler)
    })

    it('debería requerir autenticación y ownership/admin en GET /carts/:id', async () => {
        const anon = await request(app).get('/carts/507f1f77bcf86cd799439011')
        const mismatch = await request(app).get('/carts/507f1f77bcf86cd799439011').set('x-test-role', 'user').set('x-test-user-id', '507f1f77bcf86cd799439012')
        const owner = await request(app).get('/carts/507f1f77bcf86cd799439011').set('x-test-role', 'user').set('x-test-user-id', '507f1f77bcf86cd799439011')
        const admin = await request(app).get('/carts/507f1f77bcf86cd799439011').set('x-test-role', 'admin')
        expect(anon.status).toBe(401)
        expect(mismatch.status).toBe(403)
        expect(owner.status).toBe(200)
        expect(admin.status).toBe(200)
    })

    it('debería crear carrito solo autenticado', async () => {
        const anon = await request(app).post('/carts')
        const user = await request(app).post('/carts').set('x-test-role', 'user')
        expect(anon.status).toBe(401)
        expect(user.status).toBe(201)
    })

    it('debería validar ids y ownership en POST /carts/:cid/product/:pid', async () => {
        const bad = await request(app).post('/carts/invalid-id/product/invalid-id').set('x-test-role', 'user').send({ productId: 'x', quantity: 1 })
        const mismatch = await request(app).post('/carts/507f1f77bcf86cd799439011/product/507f1f77bcf86cd799439022').set('x-test-role', 'user').set('x-test-user-id', '507f1f77bcf86cd799439012').send({ productId: '507f1f77bcf86cd799439022', quantity: 1 })
        const owner = await request(app).post('/carts/507f1f77bcf86cd799439011/product/507f1f77bcf86cd799439022').set('x-test-role', 'user').set('x-test-user-id', '507f1f77bcf86cd799439011').send({ productId: '507f1f77bcf86cd799439022', quantity: 1 })
        expect(bad.status).toBe(400)
        expect(mismatch.status).toBe(403)
        expect(owner.status).toBe(200)
    })

    it('debería permitir owner/admin en PUT /carts/:cid y /carts/:cid/product/:pid', async () => {
        const mismatch = await request(app).put('/carts/507f1f77bcf86cd799439011').set('x-test-role', 'user').set('x-test-user-id', '507f1f77bcf86cd799439012').send({ products: [] })
        const owner = await request(app).put('/carts/507f1f77bcf86cd799439011').set('x-test-role', 'user').set('x-test-user-id', '507f1f77bcf86cd799439011').send({ products: [] })
        const admin = await request(app).put('/carts/507f1f77bcf86cd799439011/product/507f1f77bcf86cd799439022').set('x-test-role', 'admin').send({ quantity: 2 })
        expect(mismatch.status).toBe(403)
        expect(owner.status).toBe(200)
        expect(admin.status).toBe(200)
    })

    it('debería permitir owner/admin en DELETE /carts/:cid y /carts/:cid/product/:pid', async () => {
        const mismatch1 = await request(app).delete('/carts/507f1f77bcf86cd799439011').set('x-test-role', 'user').set('x-test-user-id', '507f1f77bcf86cd799439012')
        const owner1 = await request(app).delete('/carts/507f1f77bcf86cd799439011').set('x-test-role', 'user').set('x-test-user-id', '507f1f77bcf86cd799439011')
        const admin1 = await request(app).delete('/carts/507f1f77bcf86cd799439011/product/507f1f77bcf86cd799439022').set('x-test-role', 'admin')
        expect(mismatch1.status).toBe(403)
        expect(owner1.status).toBe(204)
        expect(admin1.status).toBe(200)
    })

    it('debería permitir owner/admin en POST /carts/:cid/purchase', async () => {
        const mismatch = await request(app).post('/carts/507f1f77bcf86cd799439011/purchase').set('x-test-role', 'user').set('x-test-user-id', '507f1f77bcf86cd799439012')
        const owner = await request(app).post('/carts/507f1f77bcf86cd799439011/purchase').set('x-test-role', 'user').set('x-test-user-id', '507f1f77bcf86cd799439011')
        const admin = await request(app).post('/carts/507f1f77bcf86cd799439011/purchase').set('x-test-role', 'admin')
        expect(mismatch.status).toBe(403)
        expect(owner.status).toBe(200)
        expect(admin.status).toBe(200)
    })
})
