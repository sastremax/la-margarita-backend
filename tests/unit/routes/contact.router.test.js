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

vi.mock('../../../src/middlewares/rateLimiter.js', () => ({
    contactLimiter: (req, res, next) => next()
}))

vi.mock('../../../src/controllers/contact.controller.js', () => ({
    submitContactForm: (req, res) => res.status(201).json({ route: 'submitContactForm' }),
    replyToContact: (req, res) => res.status(200).json({ route: 'replyToContact', id: req.params.id })
}))

const errorHandler = (err, req, res, next) => {
    const status = err?.statusCode || 500
    res.status(status).json({ status: 'error', message: err?.message || 'error' })
}

describe('contact.router', () => {
    let app

    beforeEach(async () => {
        vi.resetModules()
        const mod = await import('../../../src/routes/contact.router.js')
        const { contactRouter } = mod
        app = express()
        app.use(express.json())
        app.use('/contact', contactRouter)
        app.use(errorHandler)
    })

    it('debería validar el body y crear contacto en POST /contact', async () => {
        const bad = await request(app).post('/contact').send({ name: 'A', email: 'x', message: 'corto' })
        const ok = await request(app).post('/contact').send({ name: 'Juan Pérez', email: 'jp@example.com', message: 'Mensaje válido con más de diez caracteres' })
        expect(bad.status).toBe(400)
        expect(ok.status).toBe(201)
        expect(ok.body.route).toBe('submitContactForm')
    })

    it('debería validar id y requerir admin en PUT /contact/:id/reply', async () => {
        const badId = await request(app).put('/contact/invalid-id/reply').set('x-test-role', 'admin').send({ replied: true })
        const forbidden = await request(app).put('/contact/507f1f77bcf86cd799439011/reply').set('x-test-role', 'user').send({ replied: true })
        const ok = await request(app).put('/contact/507f1f77bcf86cd799439011/reply').set('x-test-role', 'admin').send({ replied: true, replyNote: 'Gracias por contactarnos' })
        expect(badId.status).toBe(400)
        expect(forbidden.status).toBe(403)
        expect(ok.status).toBe(200)
        expect(ok.body.route).toBe('replyToContact')
    })
})
