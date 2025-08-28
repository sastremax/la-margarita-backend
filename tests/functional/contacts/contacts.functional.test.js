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

describe('Contacts', () => {
    let contactId

    beforeAll(async () => {
        await connectToDB()
    })

    afterAll(async () => {
        await mongoose.connection.close(true)
    })

    it('debería crear un contacto válido y devolver el DTO', async () => {
        const payload = { name: 'Juan Pérez', email: `juan${Date.now()}@example.com`, message: 'Consulta de disponibilidad.' }
        const res = await request(app).post('/api/contact').send(payload)
        expect(res.status).toBe(201)
        expect(res.body.status).toBe('success')
        expect(typeof res.body.data.id).toBe('string')
        contactId = res.body.data.id
    })

    it('debería rechazar payload inválido con 400', async () => {
        const res = await request(app).post('/api/contact').send({ name: 'A', email: 'no-es-email', message: 'corto' })
        expect(res.status).toBe(400)
        expect(res.body.status).toBe('error')
    })

    it('debería permitir a admin responder un contacto', async () => {
        const cookie = await getAuthCookie()
        const res = await request(app).put(`/api/contact/${contactId}/reply`).set('Cookie', cookie).send({ replied: true, replyNote: 'Respondido.' })
        expect(res.status).toBe(200)
        expect(res.body.status).toBe('success')
        expect(res.body.data.id).toBe(contactId)
        expect(res.body.data.replied).toBe(true)
    })

    it('debería requerir autenticación para responder', async () => {
        const res = await request(app).put(`/api/contact/${contactId}/reply`).send({ replied: true })
        expect([401, 403]).toContain(res.status)
        expect(res.body.status).toBe('error')
    })
})
