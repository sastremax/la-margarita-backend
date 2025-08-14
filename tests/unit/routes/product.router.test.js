import express from 'express'
import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../../src/middlewares/authPolicy.middleware.js', () => ({
    authPolicy: (roles = []) => [
        (req, res, next) => {
            const role = req.headers['x-test-role']
            const uid = req.headers['x-test-user-id']
            if (role) req.user = { id: uid || 'u1', role }
            next()
        },
        (req, res, next) => {
            if (!req.user) return next({ statusCode: 401, message: 'Not authenticated' })
            if (roles.length && !roles.includes(req.user.role)) return next({ statusCode: 403, message: 'Access denied' })
            next()
        }
    ]
}))

vi.mock('../../../src/controllers/product.controller.js', () => ({
    getAllProducts: (req, res) => res.status(200).json({ route: 'getAllProducts' }),
    getProductById: (req, res) => res.status(200).json({ route: 'getProductById', id: req.params.id }),
    createProduct: (req, res) => res.status(201).json({ route: 'createProduct' }),
    updateProduct: (req, res) => res.status(200).json({ route: 'updateProduct', id: req.params.id }),
    deleteProduct: (req, res) => res.status(204).end()
}))

const errorHandler = (err, req, res, next) => {
    const status = err?.statusCode || 500
    res.status(status).json({ status: 'error', message: err?.message || 'error' })
}

describe('product.router', () => {
    let app

    beforeEach(async () => {
        vi.resetModules()
        const mod = await import('../../../src/routes/product.router.js')
        const { productRouter } = mod
        app = express()
        app.use(express.json())
        app.use('/products', productRouter)
        app.use(errorHandler)
    })

    it('debería listar públicamente GET /products', async () => {
        const res = await request(app).get('/products')
        expect(res.status).toBe(200)
        expect(res.body.route).toBe('getAllProducts')
    })

    it('debería validar ObjectId en GET /products/:id', async () => {
        const bad = await request(app).get('/products/invalid-id')
        const ok = await request(app).get('/products/507f1f77bcf86cd799439011')
        expect(bad.status).toBe(400)
        expect(ok.status).toBe(200)
        expect(ok.body.id).toBe('507f1f77bcf86cd799439011')
    })

    it('debería requerir admin en POST /products y validar body', async () => {
        const anon = await request(app).post('/products').send({})
        const user = await request(app).post('/products').set('x-test-role', 'user').send({})
        const admin = await request(app).post('/products').set('x-test-role', 'admin').send({
            title: 'T',
            description: 'D',
            price: 10,
            code: 'CODE-1',
            category: 'food',
            stock: 5,
            images: ['https://example.com/a.jpg']
        })
        expect(anon.status).toBe(401)
        expect(user.status).toBe(403)
        expect(admin.status).toBe(201)
    })

    it('debería validar y requerir admin en PUT /products/:id', async () => {
        const badId = await request(app).put('/products/invalid-id').set('x-test-role', 'admin')
        const user = await request(app).put('/products/507f1f77bcf86cd799439011').set('x-test-role', 'user').send({ title: 'N' })
        const admin = await request(app).put('/products/507f1f77bcf86cd799439011').set('x-test-role', 'admin').send({ title: 'N' })
        expect(badId.status).toBe(400)
        expect(user.status).toBe(403)
        expect(admin.status).toBe(200)
        expect(admin.body.id).toBe('507f1f77bcf86cd799439011')
    })

    it('debería validar y requerir admin en DELETE /products/:id', async () => {
        const badId = await request(app).delete('/products/invalid-id').set('x-test-role', 'admin')
        const user = await request(app).delete('/products/507f1f77bcf86cd799439011').set('x-test-role', 'user')
        const admin = await request(app).delete('/products/507f1f77bcf86cd799439011').set('x-test-role', 'admin')
        expect(badId.status).toBe(400)
        expect(user.status).toBe(403)
        expect(admin.status).toBe(204)
    })
})
