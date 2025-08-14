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

vi.mock('../../../src/middlewares/exists/validateReservationExists.js', () => ({
    validateReservationExists: (req, res, next) => {
        req.reservation = {
            _id: 'r1',
            user: { _id: { toString: () => '507f1f77bcf86cd799439011' } }
        }
        next()
    }
}))

vi.mock('../../../src/controllers/reservation.controller.js', () => ({
    getAllReservations: (req, res) => res.status(200).json({ route: 'getAllReservations', query: req.query }),
    getReservationSummary: (req, res) => res.status(200).json({ route: 'getReservationSummary' }),
    getReservationsByUser: (req, res) => res.status(200).json({ route: 'getReservationsByUser', userId: req.user.id }),
    getReservationById: (req, res) => res.status(200).json({ route: 'getReservationById', rid: req.params.rid }),
    createReservation: (req, res) => res.status(201).json({ route: 'createReservation' }),
    deleteReservation: (req, res) => res.status(204).end()
}))

const errorHandler = (err, req, res, next) => {
    const status = err?.statusCode || 500
    res.status(status).json({ status: 'error', message: err?.message || 'error' })
}

describe('reservation.router', () => {
    let app

    beforeEach(async () => {
        vi.resetModules()
        const mod = await import('../../../src/routes/reservation.router.js')
        const { reservationRouter } = mod
        app = express()
        app.use(express.json())
        app.use('/reservations', reservationRouter)
        app.use(errorHandler)
    })

    it('debería validar query con Zod en GET /reservations', async () => {
        const bad = await request(app).get('/reservations?page=abc').set('x-test-role', 'admin')
        const ok = await request(app).get('/reservations?page=1&limit=10').set('x-test-role', 'admin')
        expect(bad.status).toBe(400)
        expect(ok.status).toBe(200)
        expect(ok.body.route).toBe('getAllReservations')
        expect(ok.body.query.page).toBe(1)
        expect(ok.body.query.limit).toBe(10)
    })

    it('debería requerir admin en GET /reservations/summary', async () => {
        const userRes = await request(app).get('/reservations/summary').set('x-test-role', 'user')
        const adminRes = await request(app).get('/reservations/summary').set('x-test-role', 'admin')
        expect(userRes.status).toBe(403)
        expect(adminRes.status).toBe(200)
        expect(adminRes.body.route).toBe('getReservationSummary')
    })

    it('debería requerir user en GET /reservations/user y usar req.user.id', async () => {
        const userRes = await request(app).get('/reservations/user').set('x-test-role', 'user').set('x-test-user-id', '507f1f77bcf86cd799439011')
        const adminRes = await request(app).get('/reservations/user').set('x-test-role', 'admin')
        expect(userRes.status).toBe(200)
        expect(userRes.body.userId).toBe('507f1f77bcf86cd799439011')
        expect(adminRes.status).toBe(403)
    })

    it('debería validar rid y aplicar owner/admin en GET /reservations/:rid', async () => {
        const badId = await request(app).get('/reservations/invalid-id').set('x-test-role', 'user')
        expect(badId.status).toBe(400)

        const mismatch = await request(app).get('/reservations/507f1f77bcf86cd799439099').set('x-test-role', 'user').set('x-test-user-id', '507f1f77bcf86cd799439012')
        expect(mismatch.status).toBe(403)

        const owner = await request(app).get('/reservations/507f1f77bcf86cd799439011').set('x-test-role', 'user').set('x-test-user-id', '507f1f77bcf86cd799439011')
        expect(owner.status).toBe(200)

        const admin = await request(app).get('/reservations/507f1f77bcf86cd799439011').set('x-test-role', 'admin')
        expect(admin.status).toBe(200)
    })

    it('debería requerir user en POST /reservations', async () => {
        const anon = await request(app).post('/reservations')
        const admin = await request(app).post('/reservations').set('x-test-role', 'admin')
        const user = await request(app).post('/reservations').set('x-test-role', 'user').set('x-test-user-id', '507f1f77bcf86cd799439011').send({
            lodgingId: 'l1',
            checkIn: '2025-08-11',
            checkOut: '2025-08-12',
            guests: 2
        })
        expect(anon.status).toBe(401)
        expect(admin.status).toBe(403)
        expect(user.status).toBe(201)
    })

    it('debería validar y requerir admin en DELETE /reservations/:rid', async () => {
        const bad = await request(app).delete('/reservations/invalid-id').set('x-test-role', 'admin')
        const ok = await request(app).delete('/reservations/507f1f77bcf86cd799439011').set('x-test-role', 'admin')
        expect(bad.status).toBe(400)
        expect(ok.status).toBe(204)
    })
})
