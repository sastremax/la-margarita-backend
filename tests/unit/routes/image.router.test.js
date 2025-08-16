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

vi.mock('../../../src/controllers/image.controller.js', () => ({
    uploadImage: (req, res) => res.status(201).json({ route: 'uploadImage' }),
    getAllImages: (req, res) => res.status(200).json({ route: 'getAllImages' }),
    getImageById: (req, res) => res.status(200).json({ route: 'getImageById', id: req.params.id }),
    getImagesByLodgingId: (req, res) => res.status(200).json({ route: 'getImagesByLodgingId', lodgingId: req.params.lodgingId }),
    deleteImage: (req, res) => res.status(200).json({ route: 'deleteImage', id: req.params.id })
}))

const errorHandler = (err, req, res, next) => {
    const status = err?.statusCode || 500
    res.status(status).json({ status: 'error', message: err?.message || 'error' })
}

describe('image.router', () => {
    let app

    beforeEach(async () => {
        vi.resetModules()
        const mod = await import('../../../src/routes/image.router.js')
        const { imageRouter } = mod
        app = express()
        app.use(express.json())
        app.use('/images', imageRouter)
        app.use(errorHandler)
    })

    it('debería requerir admin en POST /images y validar body', async () => {
        const anon = await request(app).post('/images').send({})
        const user = await request(app).post('/images').set('x-test-role', 'user').send({})
        const admin = await request(app).post('/images').set('x-test-role', 'admin').send({
            url: 'https://example.com/a.jpg',
            name: 'a',
            type: 'lodging',
            refId: '507f1f77bcf86cd799439011'
        })
        expect(anon.status).toBe(401)
        expect(user.status).toBe(403)
        expect(admin.status).toBe(201)
    })

    it('debería requerir admin en GET /images', async () => {
        const user = await request(app).get('/images').set('x-test-role', 'user')
        const admin = await request(app).get('/images').set('x-test-role', 'admin')
        expect(user.status).toBe(403)
        expect(admin.status).toBe(200)
        expect(admin.body.route).toBe('getAllImages')
    })

    it('debería ubicar /lodging antes que /:id y validar ObjectId en GET /images/lodging/:lodgingId', async () => {
        const bad = await request(app).get('/images/lodging/invalid-id').set('x-test-role', 'admin')
        const ok = await request(app).get('/images/lodging/507f1f77bcf86cd799439011').set('x-test-role', 'admin')
        expect(bad.status).toBe(400)
        expect(ok.status).toBe(200)
        expect(ok.body.route).toBe('getImagesByLodgingId')
    })

    it('debería validar ObjectId y requerir admin en GET /images/:id', async () => {
        const bad = await request(app).get('/images/invalid-id').set('x-test-role', 'admin')
        const ok = await request(app).get('/images/507f1f77bcf86cd799439011').set('x-test-role', 'admin')
        expect(bad.status).toBe(400)
        expect(ok.status).toBe(200)
        expect(ok.body.id).toBe('507f1f77bcf86cd799439011')
    })

    it('debería validar ObjectId y requerir admin en DELETE /images/:id', async () => {
        const bad = await request(app).delete('/images/invalid-id').set('x-test-role', 'admin')
        const user = await request(app).delete('/images/507f1f77bcf86cd799439011').set('x-test-role', 'user')
        const admin = await request(app).delete('/images/507f1f77bcf86cd799439011').set('x-test-role', 'admin')
        expect(bad.status).toBe(400)
        expect(user.status).toBe(403)
        expect(admin.status).toBe(200)
        expect(admin.body.route).toBe('deleteImage')
    })
})
