import express from 'express'
import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('passport', () => {
    return {
        default: {
            authenticate: vi.fn(() => {
                return (req, res, next) => {
                    const role = req.headers['x-test-role'] || 'user'
                    req.user = { id: 'u1', role }
                    next()
                }
            })
        }
    }
})

vi.mock('../../../src/middlewares/universalAuth.middleware.js', () => ({
    universalAuth: (req, res, next) => {
        const role = req.headers['x-test-role'] || 'user'
        req.user = { id: 'u1', role }
        next()
    }
}))

vi.mock('../../../src/controllers/user.controller.js', () => ({
    getAllUsers: (req, res) => res.status(200).json({ route: 'getAllUsers' }),
    getUserById: (req, res) => res.status(200).json({ route: 'getUserById', uid: req.params.uid }),
    getCurrentUser: (req, res) => res.status(200).json({ route: 'getCurrentUser', user: req.user }),
    getCurrentUserReservations: (req, res) => res.status(200).json({ route: 'getCurrentUserReservations', user: req.user }),
    getCurrentUserCart: (req, res) => res.status(200).json({ route: 'getCurrentUserCart', user: req.user }),
    deleteUser: (req, res) => res.status(204).end(),
    updateUserRole: (req, res) => res.status(200).json({ route: 'updateUserRole', uid: req.params.uid })
}))

const errorHandler = (err, req, res, next) => {
    const status = err?.statusCode || 500
    res.status(status).json({ status: 'error', message: err?.message || 'error' })
}

describe('user.router', () => {
    let app

    beforeEach(async () => {
        vi.resetModules()
        const mod = await import('../../../src/routes/user.router.js')
        const { userRouter } = mod
        app = express()
        app.use(express.json())
        app.use('/users', userRouter)
        app.use(errorHandler)
    })

    it('debería requerir rol admin en GET /users', async () => {
        const resUser = await request(app).get('/users').set('x-test-role', 'user')
        const resAdmin = await request(app).get('/users').set('x-test-role', 'admin')
        expect(resUser.status).toBe(403)
        expect(resAdmin.status).toBe(200)
        expect(resAdmin.body.route).toBe('getAllUsers')
    })

    it('debería validar y requerir admin en GET /users/:uid', async () => {
        const bad = await request(app).get('/users/invalid-id').set('x-test-role', 'admin')
        const ok = await request(app).get('/users/507f1f77bcf86cd799439011').set('x-test-role', 'admin')
        expect(bad.status).toBe(400)
        expect(ok.status).toBe(200)
        expect(ok.body.uid).toBe('507f1f77bcf86cd799439011')
    })

    it('debería devolver el usuario actual en GET /users/me', async () => {
        const res = await request(app).get('/users/me').set('x-test-role', 'user')
        expect(res.status).toBe(200)
        expect(res.body.route).toBe('getCurrentUser')
        expect(res.body.user.role).toBe('user')
    })

    it('debería permitir admin y user en GET /users/me/reservations', async () => {
        const rUser = await request(app).get('/users/me/reservations').set('x-test-role', 'user')
        const rAdmin = await request(app).get('/users/me/reservations').set('x-test-role', 'admin')
        expect(rUser.status).toBe(200)
        expect(rAdmin.status).toBe(200)
    })

    it('debería permitir admin y user en GET /users/me/cart', async () => {
        const rUser = await request(app).get('/users/me/cart').set('x-test-role', 'user')
        const rAdmin = await request(app).get('/users/me/cart').set('x-test-role', 'admin')
        expect(rUser.status).toBe(200)
        expect(rAdmin.status).toBe(200)
    })

    it('debería validar y requerir admin en DELETE /users/:uid', async () => {
        const bad = await request(app).delete('/users/invalid-id').set('x-test-role', 'admin')
        const ok = await request(app).delete('/users/507f1f77bcf86cd799439011').set('x-test-role', 'admin')
        expect(bad.status).toBe(400)
        expect(ok.status).toBe(204)
    })

    it('debería validar y requerir admin en PUT /users/:uid/role', async () => {
        const bad = await request(app).put('/users/invalid-id/role').set('x-test-role', 'admin')
        const ok = await request(app).put('/users/507f1f77bcf86cd799439011/role').set('x-test-role', 'admin').send({ role: 'user' })
        expect(bad.status).toBe(400)
        expect(ok.status).toBe(200)
        expect(ok.body.route).toBe('updateUserRole')
    })
})
