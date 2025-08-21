import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import '../setup/env.setup.js'
import { getSupertestTarget } from '../setup/server.helper.js'
import { loginAdmin } from '../setup/auth.helper.js'
import { uniqueCode } from '../setup/data.helper.js'

let target
let adminCookie
let adminId
let lodgingId
let imageId

const buildCookieHeader = (setCookie) => {
    const arr = Array.isArray(setCookie) ? setCookie : [setCookie]
    const pairs = arr.map(s => String(s).split(';')[0]).filter(Boolean)
    return pairs.join('; ')
}

const resolveCurrentUserId = async (cookie) => {
    const candidates = [
        { m: 'get', u: '/api/sessions/current' },
        { m: 'get', u: '/api/users/me' }
    ]
    for (const c of candidates) {
        try {
            const r = await request(target)[c.m](c.u).set('Cookie', cookie)
            if (r.status !== 200) continue
            const b = r.body || {}
            const paths = [
                ['data', 'id'], ['data', '_id'], ['user', 'id'], ['user', '_id'], ['id'], ['_id']
            ]
            for (const p of paths) {
                let v = b
                for (const k of p) v = v && v[k]
                if (typeof v === 'string' && v.length > 0) return v
            }
        } catch { }
    }
    return null
}

describe('Images', () => {
    beforeAll(async () => {
        target = await getSupertestTarget()
        const admin = await loginAdmin()
        adminCookie = admin.cookie

        adminId = await resolveCurrentUserId(adminCookie)
        expect(typeof adminId).toBe('string')

        const createLodging = await request(target)
            .post('/api/lodgings')
            .set('Cookie', adminCookie)
            .send({
                title: `Lodging ${uniqueCode('LG')}`,
                description: 'Alojamiento para pruebas funcionales de imágenes',
                images: [],
                location: { country: 'AR', province: 'Buenos Aires', city: 'La Plata' },
                capacity: 2,
                pricing: { weekday: 100, weekend: 150 },
                ownerId: adminId,
                isActive: true
            })

        expect([200, 201]).toContain(createLodging.status)
        lodgingId = createLodging.body?.data?.id || createLodging.body?.data?._id
        expect(typeof lodgingId).toBe('string')
    })

    it('debería crear una imagen asociada a un lodging', async () => {
        const payload = {
            url: `https://example.com/${uniqueCode('IMG')}.jpg`,
            name: `Foto ${uniqueCode('NM')}`,
            type: 'lodging',
            refId: lodgingId,
            publicId: `pub_${uniqueCode('PID')}`
        }

        const res = await request(target)
            .post('/api/images')
            .set('Cookie', adminCookie)
            .send(payload)

        expect(res.status).toBe(201)
        expect(res.body?.status).toBe('success')
        expect(typeof res.body?.data?.id).toBe('string')
        expect(res.body?.data?.url).toBe(payload.url)
        expect(res.body?.data?.name).toBe(payload.name)
        expect(res.body?.data?.type).toBe('lodging')
        expect(res.body?.data?.refId).toBe(lodgingId)

        imageId = res.body.data.id
    })

    it('debería listar todas las imágenes', async () => {
        const res = await request(target)
            .get('/api/images')
            .set('Cookie', adminCookie)

        expect(res.status).toBe(200)
        expect(res.body?.status).toBe('success')
        expect(Array.isArray(res.body?.data)).toBe(true)
        expect(res.body.data.some(x => x.id === imageId)).toBe(true)
    })

    it('debería listar imágenes por lodgingId', async () => {
        const res = await request(target)
            .get(`/api/images/lodging/${lodgingId}`)
            .set('Cookie', adminCookie)

        expect(res.status).toBe(200)
        expect(res.body?.status).toBe('success')
        expect(Array.isArray(res.body?.data)).toBe(true)
        expect(res.body.data.some(x => x.refId === lodgingId)).toBe(true)
    })

    it('debería obtener una imagen por id', async () => {
        const res = await request(target)
            .get(`/api/images/${imageId}`)
            .set('Cookie', adminCookie)

        expect(res.status).toBe(200)
        expect(res.body?.status).toBe('success')
        expect(res.body?.data?.id).toBe(imageId)
    })

    it('debería eliminar una imagen por id y luego responder 404 al consultarla', async () => {
        const del = await request(target)
            .delete(`/api/images/${imageId}`)
            .set('Cookie', adminCookie)

        expect([200]).toContain(del.status)
        expect(del.body?.status).toBe('success')

        const getAfter = await request(target)
            .get(`/api/images/${imageId}`)
            .set('Cookie', adminCookie)

        expect(getAfter.status).toBe(404)
    })
})
