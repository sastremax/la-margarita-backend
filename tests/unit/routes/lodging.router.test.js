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

vi.mock('../../../src/middlewares/existsLodging.middleware.js', () => ({
    existsLodging: (req, res, next) => {
        req.lodging = { id: req.params.lid }
        next()
    }
}))

vi.mock('../../../src/middlewares/validateRequest.middleware.js', () => ({
    validateRequest: (req, res, next) => {
        const isHex24 = s => typeof s === 'string' && /^[a-f\d]{24}$/i.test(s)
        const { uid, lid } = req.params || {}
        if ((uid && !isHex24(uid)) || (lid && !isHex24(lid))) return next({ statusCode: 400, message: 'Invalid id' })
        next()
    }
}))

vi.mock('../../../src/middlewares/validateDTO.middleware.js', () => ({
    validateDTO: () => (req, res, next) => next()
}))

vi.mock('../../../src/controllers/lodging.controller.js', () => ({
    getAllLodgings: (req, res) => res.status(200).json({ route: 'getAllLodgings' }),
    getLodgingById: (req, res) => res.status(200).json({ route: 'getLodgingById', lid: req.params.lid }),
    getLodgingsByOwner: (req, res) => res.status(200).json({ route: 'getLodgingsByOwner', uid: req.params.uid }),
    createLodging: (req, res) => res.status(201).json({ route: 'createLodging' }),
    updateLodging: (req, res) => res.status(200).json({ route: 'updateLodging', lid: req.params.lid }),
    disableLodging: (req, res) => res.status(200).json({ route: 'disableLodging', lid: req.params.lid }),
    deleteLodging: (req, res) => res.status(204).end()
}))

const errorHandler = (err, req, res, next) => {
    const status = err?.statusCode || 500
    res.status(status).json({ status: 'error', message: err?.message || 'error' })
}

describe('lodging.router', () => {
    let app

    beforeEach(async () => {
        vi.resetModules()
        const mod = await import('../../../src/routes/lodging.router.js')
        const { lodgingRouter } = mod
        app = express()
        app.use(express.json())
        app.use('/lodgings', lodgingRouter)
        app.use(errorHandler)
    })

    it('debería listar públicamente GET /lodgings', async () => {
        const res = await request(app).get('/lodgings')
        expect(res.status).toBe(200)
        expect(res.body.route).toBe('getAllLodgings')
    })

    it('debería ubicar /owner antes que /:lid', async () => {
        const res = await request(app).get('/lodgings/owner/507f1f77bcf86cd799439011').set('x-test-role', 'admin')
        expect(res.status).toBe(200)
        expect(res.body.route).toBe('getLodgingsByOwner')
    })

    it('debería validar MongoId en GET /lodgings/:lid', async () => {
        const bad = await request(app).get('/lodgings/invalid-id')
        expect(bad.status).toBe(400)
    })

    it('debería aplicar existsLodging en GET /lodgings/:lid válido', async () => {
        const ok = await request(app).get('/lodgings/507f1f77bcf86cd799439011')
        expect(ok.status).toBe(200)
        expect(ok.body.route).toBe('getLodgingById')
    })

    it('debería exigir mismo usuario o admin en GET /lodgings/owner/:uid', async () => {
        const mismatch = await request(app).get('/lodgings/owner/507f1f77bcf86cd799439012').set('x-test-role', 'user').set('x-test-user-id', '507f1f77bcf86cd799439013')
        const match = await request(app).get('/lodgings/owner/507f1f77bcf86cd799439011').set('x-test-role', 'user').set('x-test-user-id', '507f1f77bcf86cd799439011')
        const admin = await request(app).get('/lodgings/owner/507f1f77bcf86cd799439012').set('x-test-role', 'admin')
        expect(mismatch.status).toBe(403)
        expect(match.status).toBe(200)
        expect(admin.status).toBe(200)
    })

    it('debería requerir admin en POST /lodgings', async () => {
        const userRes = await request(app).post('/lodgings').set('x-test-role', 'user')
        const adminRes = await request(app).post('/lodgings').set('x-test-role', 'admin')
        expect(userRes.status).toBe(403)
        expect(adminRes.status).toBe(201)
    })

    it('debería validar y requerir admin en PUT /lodgings/:lid', async () => {
        const bad = await request(app).put('/lodgings/invalid-id').set('x-test-role', 'admin')
        const ok = await request(app).put('/lodgings/507f1f77bcf86cd799439011').set('x-test-role', 'admin')
        expect(bad.status).toBe(400)
        expect(ok.status).toBe(200)
    })

    it('debería validar y requerir admin en PUT /lodgings/:lid/disable', async () => {
        const bad = await request(app).put('/lodgings/invalid-id/disable').set('x-test-role', 'admin')
        const ok = await request(app).put('/lodgings/507f1f77bcf86cd799439011/disable').set('x-test-role', 'admin')
        expect(bad.status).toBe(400)
        expect(ok.status).toBe(200)
    })

    it('debería validar y requerir admin en DELETE /lodgings/:lid', async () => {
        const bad = await request(app).delete('/lodgings/invalid-id').set('x-test-role', 'admin')
        const ok = await request(app).delete('/lodgings/507f1f77bcf86cd799439011').set('x-test-role', 'admin')
        expect(bad.status).toBe(400)
        expect(ok.status).toBe(204)
    })
})
