import express from 'express'
import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../../src/routes/auth.router.js', () => {
    const r = express.Router()
    r.get('/ping', (req, res) => res.status(200).json({ ok: true, route: 'sessions' }))
    return { authRouter: r }
})

vi.mock('../../../src/routes/cart.router.js', () => {
    const r = express.Router()
    r.get('/ping', (req, res) => res.status(200).json({ ok: true, route: 'carts' }))
    return { cartRouter: r }
})

vi.mock('../../../src/routes/contact.router.js', () => {
    const r = express.Router()
    r.get('/ping', (req, res) => res.status(200).json({ ok: true, route: 'contact' }))
    return { contactRouter: r }
})

vi.mock('../../../src/routes/image.router.js', () => {
    const r = express.Router()
    r.get('/ping', (req, res) => res.status(200).json({ ok: true, route: 'images' }))
    return { imageRouter: r }
})

vi.mock('../../../src/routes/lodging.router.js', () => {
    const r = express.Router()
    r.get('/ping', (req, res) => res.status(200).json({ ok: true, route: 'lodgings' }))
    return { lodgingRouter: r }
})

vi.mock('../../../src/routes/product.router.js', () => {
    const r = express.Router()
    r.get('/ping', (req, res) => res.status(200).json({ ok: true, route: 'products' }))
    return { productRouter: r }
})

vi.mock('../../../src/routes/reservation.router.js', () => {
    const r = express.Router()
    r.get('/ping', (req, res) => res.status(200).json({ ok: true, route: 'reservations' }))
    return { reservationRouter: r }
})

vi.mock('../../../src/routes/review.router.js', () => {
    const r = express.Router()
    r.get('/ping', (req, res) => res.status(200).json({ ok: true, route: 'reviews' }))
    return { reviewRouter: r }
})

vi.mock('../../../src/routes/user.router.js', () => {
    const r = express.Router()
    r.get('/ping', (req, res) => res.status(200).json({ ok: true, route: 'users' }))
    return { userRouter: r }
})

describe('routes/index', () => {
    let app

    beforeEach(async () => {
        const mod = await import('../../../src/routes/index.js')
        const { router } = mod
        app = express()
        app.use('/api', router)
    })

    it('debería montar /api/sessions', async () => {
        const res = await request(app).get('/api/sessions/ping')
        expect(res.status).toBe(200)
        expect(res.body.route).toBe('sessions')
    })

    it('debería montar /api/users', async () => {
        const res = await request(app).get('/api/users/ping')
        expect(res.status).toBe(200)
        expect(res.body.route).toBe('users')
    })

    it('debería montar /api/products', async () => {
        const res = await request(app).get('/api/products/ping')
        expect(res.status).toBe(200)
        expect(res.body.route).toBe('products')
    })

    it('debería montar /api/carts', async () => {
        const res = await request(app).get('/api/carts/ping')
        expect(res.status).toBe(200)
        expect(res.body.route).toBe('carts')
    })

    it('debería montar /api/reservations', async () => {
        const res = await request(app).get('/api/reservations/ping')
        expect(res.status).toBe(200)
        expect(res.body.route).toBe('reservations')
    })

    it('debería montar /api/reviews', async () => {
        const res = await request(app).get('/api/reviews/ping')
        expect(res.status).toBe(200)
        expect(res.body.route).toBe('reviews')
    })

    it('debería montar /api/images', async () => {
        const res = await request(app).get('/api/images/ping')
        expect(res.status).toBe(200)
        expect(res.body.route).toBe('images')
    })

    it('debería montar /api/contact', async () => {
        const res = await request(app).get('/api/contact/ping')
        expect(res.status).toBe(200)
        expect(res.body.route).toBe('contact')
    })

    it('debería montar /api/lodgings', async () => {
        const res = await request(app).get('/api/lodgings/ping')
        expect(res.status).toBe(200)
        expect(res.body.route).toBe('lodgings')
    })
})
