import express from 'express'
import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const loginLimiterMock = vi.fn((req, res, next) => next())
const universalAuthMock = vi.fn((req, res, next) => {
    req.user = { id: 'u1', role: 'user' }
    next()
})

vi.mock('../../../src/controllers/auth.controller.js', () => ({
    getCurrent: vi.fn((req, res) => res.status(200).json({ route: 'current' })),
    postLogin: vi.fn((req, res) => res.status(200).json({ route: 'login' })),
    postRegister: vi.fn((req, res) => res.status(201).json({ route: 'register' })),
    postLogout: vi.fn((req, res) => res.status(200).json({ route: 'logout' }))
}))

vi.mock('../../../src/controllers/refresh.controller.js', () => ({
    postRefresh: vi.fn((req, res) => res.status(200).json({ route: 'refresh' }))
}))

vi.mock('../../../src/middlewares/validateDTO.middleware.js', () => ({
    validateDTO: vi.fn(() => (req, res, next) => next())
}))

vi.mock('../../../src/middlewares/universalAuth.middleware.js', () => ({
    universalAuth: universalAuthMock
}))

vi.mock('../../../src/middlewares/rateLimiter.js', () => ({
    loginLimiter: loginLimiterMock
}))

vi.mock('../../../src/dto/user.schema.js', () => ({
    userSchemaRegister: {}
}))

describe('auth.router', () => {
    let app
    let router

    beforeEach(async () => {
        vi.clearAllMocks()
        const mod = await import('../../../src/routes/auth.router.js')
        router = mod.authRouter
        app = express()
        app.use(express.json())
        app.use('/sessions', router)
    })

    it('debería atender POST /sessions/login con loginLimiter', async () => {
        const res = await request(app).post('/sessions/login').send({ email: 'a@b.c', password: 'x' })
        expect(res.status).toBe(200)
        expect(res.body.route).toBe('login')
        expect(loginLimiterMock).toHaveBeenCalledTimes(1)
    })

    it('debería atender POST /sessions/register aplicando validateDTO', async () => {
        const res = await request(app).post('/sessions/register').send({ firstName: 'A', lastName: 'B', email: 'a@b.c', password: 'Admin$12345' })
        expect(res.status).toBe(201)
        expect(res.body.route).toBe('register')
    })

    it('debería requerir universalAuth en POST /sessions/logout', async () => {
        const res = await request(app).post('/sessions/logout')
        expect(res.status).toBe(200)
        expect(res.body.route).toBe('logout')
        expect(universalAuthMock).toHaveBeenCalledTimes(1)
    })

    it('debería refrescar tokens en POST /sessions/refresh sin universalAuth', async () => {
        const res = await request(app).post('/sessions/refresh')
        expect(res.status).toBe(200)
        expect(res.body.route).toBe('refresh')
        expect(universalAuthMock).not.toHaveBeenCalled()
    })
})
