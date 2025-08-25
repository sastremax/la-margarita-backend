import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import '../setup/env.setup.js'
import { getSupertestTarget } from '../setup/server.helper.js'
import { loginAdmin } from '../setup/auth.helper.js'
import { uniqueCode } from '../setup/data.helper.js'

let target
let adminCookie
let adminId
let userCookie
let userId
let lodgingId
let reservationId
let reviewId

const buildCookieHeader = (setCookie) => {
    const arr = Array.isArray(setCookie) ? setCookie : [setCookie]
    const pairs = arr.map(s => String(s).split(';')[0]).filter(Boolean)
    return pairs.join('; ')
}

const getCookieValue = (cookieHeader, key) => {
    if (!cookieHeader) return null
    const parts = cookieHeader.split(';').map(s => s.trim())
    const kv = parts.find(s => s.toLowerCase().startsWith(`${key.toLowerCase()}=`))
    if (!kv) return null
    const value = kv.slice(kv.indexOf('=') + 1)
    return decodeURIComponent(value)
}

const decodeJwtUserId = (token) => {
    if (!token) return null
    const parts = token.split('.')
    if (parts.length < 2) return null
    try {
        const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
        const json = Buffer.from(b64, 'base64').toString('utf8')
        const payload = JSON.parse(json)
        return payload.id || payload._id || payload.uid || null
    } catch {
        return null
    }
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
            const paths = [['data', 'id'], ['data', '_id'], ['user', 'id'], ['user', '_id'], ['id'], ['_id']]
            for (const p of paths) {
                let v = b
                for (const k of p) v = v && v[k]
                if (typeof v === 'string' && v.length > 0) return v
            }
        } catch { }
    }
    return null
}

const futureISO = (daysFromNow) => {
    const d = new Date()
    d.setUTCHours(12, 0, 0, 0)
    d.setUTCDate(d.getUTCDate() + daysFromNow)
    return d.toISOString()
}

describe('ReviewReplies', () => {
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
                description: 'Alojamiento para pruebas de replies',
                images: [],
                location: { country: 'AR', province: 'Buenos Aires', city: 'La Plata' },
                capacity: 2,
                pricing: { weekday: 100, weekend: 160 },
                ownerId: adminId,
                isActive: true
            })
        expect([200, 201]).toContain(createLodging.status)
        lodgingId = createLodging.body?.data?.id || createLodging.body?.data?._id
        expect(typeof lodgingId).toBe('string')

        const email = `reply.${uniqueCode('USR')}@example.com`
        const password = 'Test1234!'
        const reg = await request(target).post('/api/sessions/register').send({ firstName: 'Re', lastName: 'Ply', email, password })
        expect([200, 201, 409]).toContain(reg.status)

        const login = await request(target).post('/api/sessions/login').send({ email, password })
        expect(login.status).toBe(200)
        userCookie = buildCookieHeader(login.headers['set-cookie'])
        const token = getCookieValue(userCookie, 'token')
        userId = decodeJwtUserId(token) || await resolveCurrentUserId(userCookie)
        expect(typeof userId).toBe('string')

        const rCreate = await request(target)
            .post('/api/reservations')
            .set('Cookie', userCookie)
            .send({ userId, lodgingId, checkIn: futureISO(7), checkOut: futureISO(10), guests: 2 })
        expect([200, 201]).toContain(rCreate.status)
        reservationId = rCreate.body?.data?.id || rCreate.body?.data?._id
        expect(typeof reservationId).toBe('string')

        const review = await request(target)
            .post('/api/reviews')
            .set('Cookie', userCookie)
            .send({
                user: userId,
                lodging: lodgingId,
                reservation: reservationId,
                rating: 5,
                cleanliness: 4,
                location: 4,
                service: 5,
                valueForMoney: 5,
                comment: 'Muy buena estadía'
            })
        expect([200, 201]).toContain(review.status)
        reviewId = review.body?.data?.id || review.body?.data?._id
        expect(typeof reviewId).toBe('string')
    })

    it('debería permitir a admin responder una review', async () => {
        const res = await request(target)
            .put(`/api/reviews/${reviewId}/reply`)
            .set('Cookie', adminCookie)
            .send({ message: '¡Gracias por tu reseña!' })
        expect([200, 201]).toContain(res.status)
        const dto = res.body?.data || {}
        const reply = dto.adminReply || {}
        expect(typeof reply?.message).toBe('string')
    })

    it('debería reflejar hasReply=true al listar', async () => {
        const res = await request(target)
            .get('/api/reviews')
            .set('Cookie', adminCookie)
            .query({ hasReply: true, page: 1, limit: 100 })
        expect(res.status).toBe(200)
        const arr = res.body?.data || res.body?.reviews || []
        expect(Array.isArray(arr)).toBe(true)
        const item = arr.find(x => (x.id === reviewId) || ((x._id || '').toString() === reviewId))
        expect(!!item).toBe(true)
    })

    it('debería incluir adminReply al obtener la review por id', async () => {
        const res = await request(target)
            .get(`/api/reviews/${reviewId}`)
            .set('Cookie', adminCookie)
        expect(res.status).toBe(200)
        const dto = res.body?.data || {}
        const reply = dto.adminReply || {}
        expect(typeof reply?.message).toBe('string')
    })
})
