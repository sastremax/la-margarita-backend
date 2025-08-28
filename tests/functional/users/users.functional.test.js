import request from 'supertest'
import mongoose from 'mongoose'
import { beforeAll, afterAll, describe, it, expect } from 'vitest'
import { app } from '../../../src/appExpress.js'
import { connectToDB } from '../../../src/config/db.js'

const adminEmail = process.env.ADMIN_EMAIL || 'maxi@example.com'
const adminPassword = process.env.ADMIN_PASSWORD || 'Adm1n!2345'

const getAuthCookie = async () => {
    const res = await request(app).post('/api/sessions/login').send({ email: adminEmail, password: adminPassword })
    expect(res.status).toBe(200)
    const setCookie = res.headers['set-cookie'] || []
    const tokenCookie = setCookie.find(c => c.startsWith('token='))
    expect(tokenCookie).toBeDefined()
    return tokenCookie.split(';')[0]
}

describe('Users', () => {
    beforeAll(async () => {
        await connectToDB()
    })

    afterAll(async () => {
        await mongoose.connection.close(true)
    })

    it('debería loguear admin y acceder a /users', async () => {
        const cookie = await getAuthCookie()
        const res = await request(app).get('/api/users').set('Cookie', cookie)
        expect(res.status).toBe(200)
        expect(res.body.status).toBe('success')
        expect(Array.isArray(res.body.data)).toBe(true)
    })

    it('debería devolver el perfil del usuario actual en /users/me', async () => {
        const cookie = await getAuthCookie()
        const res = await request(app).get('/api/users/me').set('Cookie', cookie)
        expect(res.status).toBe(200)
        expect(res.body.status).toBe('success')
        expect(typeof res.body.data.id).toBe('string')
        expect(res.body.data.email).toBeDefined()
    })

    it('debería devolver reservas del usuario actual en /users/me/reservations', async () => {
        const cookie = await getAuthCookie()
        const res = await request(app).get('/api/users/me/reservations').set('Cookie', cookie)
        expect(res.status).toBe(200)
        expect(res.body.status).toBe('success')
        expect(Array.isArray(res.body.data)).toBe(true)
    })

    it('debería devolver cart del usuario actual en /users/me/cart', async () => {
        const cookie = await getAuthCookie()
        const res = await request(app).get('/api/users/me/cart').set('Cookie', cookie)
        expect(res.status).toBe(200)
        expect(res.body.status).toBe('success')
        expect(res.body.data).toBeDefined()
    })
})
