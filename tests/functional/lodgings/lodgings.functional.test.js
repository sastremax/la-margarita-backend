import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import { app } from '../../../src/appExpress.js'
import { loginAdmin } from '../setup/auth.helper.js'

const base = '/api/lodgings'

const unique = () => Math.random().toString(36).slice(2, 10)

const makeLodgingPayload = (ownerId) => ({
    title: `Casa de campo ${unique()}`,
    description: 'Alojamiento amplio con parque y parrilla',
    images: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'],
    location: {
        country: 'Argentina',
        province: 'Buenos Aires',
        city: 'La Plata'
    },
    capacity: 6,
    pricing: {
        weekday: 50000,
        weekend: 70000,
        holiday: 80000
    },
    ownerId
})

describe('Lodgings', () => {
    let cookie
    let adminId
    let createdId

    beforeAll(async () => {
        const { cookie: c } = await loginAdmin()
        cookie = c
        const meRes = await request(app).get('/api/users/me').set('Cookie', cookie).expect(200)
        adminId = meRes.body.data.id
        expect(adminId).toBeTruthy()
    })

    it('debería crear un lodging como admin', async () => {
        const payload = makeLodgingPayload(adminId)
        const res = await request(app).post(base).set('Cookie', cookie).send(payload).expect(201)
        expect(res.body.status).toBe('success')
        expect(res.body.data.id).toBeTruthy()
        expect(res.body.data.ownerId).toBe(adminId)
        createdId = res.body.data.id
    })

    it('debería obtener el lodging por id', async () => {
        const res = await request(app).get(`${base}/${createdId}`).set('Cookie', cookie).expect(200)
        expect(res.body.status).toBe('success')
        expect(res.body.data.id).toBe(createdId)
    })

    it('debería listar lodgings', async () => {
        const res = await request(app).get(base).expect(200)
        expect(res.body.status).toBe('success')
        expect(Array.isArray(res.body.data)).toBe(true)
        expect(res.body.data.find(x => x.id === createdId)).toBeTruthy()
    })

    it('debería actualizar un lodging', async () => {
        const updates = { title: `Casa actualizada ${unique()}`, capacity: 8 }
        const fullBody = {
            title: updates.title,
            description: 'Alojamiento amplio con parque y parrilla',
            images: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'],
            location: {
                country: 'Argentina',
                province: 'Buenos Aires',
                city: 'La Plata'
            },
            capacity: updates.capacity,
            pricing: {
                weekday: 50000,
                weekend: 70000,
                holiday: 80000
            },
            ownerId: adminId
        }

        const res = await request(app)
            .put(`${base}/${createdId}`)
            .set('Cookie', cookie)
            .send(fullBody)
            .expect(200)

        expect(res.body.status).toBe('success')
        expect(res.body.data.title).toBe(updates.title)
        expect(res.body.data.capacity).toBe(8)
    })


    it('debería deshabilitar un lodging', async () => {
        const res = await request(app).put(`${base}/${createdId}/disable`).set('Cookie', cookie).expect(200)
        expect(res.body.status).toBe('success')
        expect(res.body.data.isActive).toBe(false)
    })

    it('debería eliminar un lodging', async () => {
        await request(app).delete(`${base}/${createdId}`).set('Cookie', cookie).expect(204)
        await request(app).get(`${base}/${createdId}`).set('Cookie', cookie).expect(404)
    })
})
