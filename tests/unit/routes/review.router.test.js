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
                    if (role && uid) req.user = { id: uid, role, _id: uid }
                    else if (role) req.user = { id: 'u1', role, _id: 'u1' }
                    next()
                }
            })
        }
    }
})

vi.mock('../../../src/middlewares/exists/validateReviewExists.js', () => ({
    validateReviewExists: (req, res, next) => {
        const owner = req.headers['x-test-review-owner'] || '507f1f77bcf86cd799439011'
        req.review = { id: req.params.id, user: { id: owner } }
        next()
    }
}))

vi.mock('../../../src/controllers/review.controller.js', () => ({
    getAllReviews: (req, res) => res.status(200).json({ route: 'getAllReviews' }),
    getReviewById: (req, res) => res.status(200).json({ route: 'getReviewById', id: req.params.id }),
    createReview: (req, res) => res.status(201).json({ route: 'createReview' }),
    updateReview: (req, res) => res.status(200).json({ route: 'updateReview', id: req.params.id }),
    deleteReview: (req, res) => res.status(200).json({ route: 'deleteReview', id: req.params.id })
}))

const errorHandler = (err, req, res, next) => {
    const status = err?.statusCode || 500
    res.status(status).json({ status: 'error', message: err?.message || 'error' })
}

describe('review.router', () => {
    let app

    beforeEach(async () => {
        vi.resetModules()
        const mod = await import('../../../src/routes/review.router.js')
        const { reviewRouter } = mod
        app = express()
        app.use(express.json())
        app.use('/reviews', reviewRouter)
        app.use(errorHandler)
    })

    it('debería requerir admin y validar query en GET /reviews', async () => {
        const user = await request(app).get('/reviews').set('x-test-role', 'user')
        const bad = await request(app).get('/reviews?hasReply=maybe').set('x-test-role', 'admin')
        const ok = await request(app).get('/reviews?hasReply=true').set('x-test-role', 'admin')
        expect(user.status).toBe(403)
        expect(bad.status).toBe(400)
        expect(ok.status).toBe(200)
        expect(ok.body.route).toBe('getAllReviews')
    })

    it('debería validar ObjectId y ownership/admin en GET /reviews/:id', async () => {
        const bad = await request(app).get('/reviews/invalid-id').set('x-test-role', 'user')
        const mismatch = await request(app).get('/reviews/507f1f77bcf86cd799439099').set('x-test-role', 'user').set('x-test-user-id', '507f1f77bcf86cd799439012').set('x-test-review-owner', '507f1f77bcf86cd799439011')
        const owner = await request(app).get('/reviews/507f1f77bcf86cd799439011').set('x-test-role', 'user').set('x-test-user-id', '507f1f77bcf86cd799439011').set('x-test-review-owner', '507f1f77bcf86cd799439011')
        const admin = await request(app).get('/reviews/507f1f77bcf86cd799439011').set('x-test-role', 'admin')
        expect(bad.status).toBe(400)
        expect(mismatch.status).toBe(403)
        expect(owner.status).toBe(200)
        expect(admin.status).toBe(200)
    })

    it('debería requerir user en POST /reviews', async () => {
        const anon = await request(app).post('/reviews').send({})
        const admin = await request(app).post('/reviews').set('x-test-role', 'admin').send({})
        const user = await request(app).post('/reviews').set('x-test-role', 'user').set('x-test-user-id', '507f1f77bcf86cd799439011').send({
            user: 'u1',
            lodging: 'l1',
            reservation: 'r1',
            rating: 5,
            comment: 'ok'
        })
        expect(anon.status).toBe(401)
        expect(admin.status).toBe(403)
        expect(user.status).toBe(201)
    })

    it('debería validar id y permitir owner o admin en PUT /reviews/:id', async () => {
        const bad = await request(app).put('/reviews/invalid-id').set('x-test-role', 'user')
        const mismatch = await request(app).put('/reviews/507f1f77bcf86cd799439011').set('x-test-role', 'user').set('x-test-user-id', '507f1f77bcf86cd799439012').set('x-test-review-owner', '507f1f77bcf86cd799439011').send({ comment: 'x' })
        const owner = await request(app).put('/reviews/507f1f77bcf86cd799439011').set('x-test-role', 'user').set('x-test-user-id', '507f1f77bcf86cd799439011').set('x-test-review-owner', '507f1f77bcf86cd799439011').send({ comment: 'x' })
        const admin = await request(app).put('/reviews/507f1f77bcf86cd799439011').set('x-test-role', 'admin').send({ comment: 'x' })
        expect(bad.status).toBe(400)
        expect(mismatch.status).toBe(403)
        expect(owner.status).toBe(200)
        expect(admin.status).toBe(200)
    })

    it('debería validar id y permitir owner o admin en DELETE /reviews/:id', async () => {
        const bad = await request(app).delete('/reviews/invalid-id').set('x-test-role', 'user')
        const mismatch = await request(app).delete('/reviews/507f1f77bcf86cd799439011').set('x-test-role', 'user').set('x-test-user-id', '507f1f77bcf86cd799439012').set('x-test-review-owner', '507f1f77bcf86cd799439011')
        const owner = await request(app).delete('/reviews/507f1f77bcf86cd799439011').set('x-test-role', 'user').set('x-test-user-id', '507f1f77bcf86cd799439011').set('x-test-review-owner', '507f1f77bcf86cd799439011')
        const admin = await request(app).delete('/reviews/507f1f77bcf86cd799439011').set('x-test-role', 'admin')
        expect(bad.status).toBe(400)
        expect(mismatch.status).toBe(403)
        expect(owner.status).toBe(200)
        expect(admin.status).toBe(200)
    })
})
