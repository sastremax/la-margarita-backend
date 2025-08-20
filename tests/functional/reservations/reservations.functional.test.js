import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import '../setup/env.setup.js'
import { getSupertestTarget } from '../setup/server.helper.js'
import { loginAdmin } from '../setup/auth.helper.js'
import { uniqueCode } from '../setup/data.helper.js'

let target
let adminCookie
let userCookie
let userId
let lodgingId
let reservationId

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
        return payload.id || payload._id || payload.uid || payload.sub || null
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

const futureISO = (daysFromNow) => {
    const d = new Date()
    d.setUTCHours(12, 0, 0, 0)
    d.setUTCDate(d.getUTCDate() + daysFromNow)
    return d.toISOString()
}

describe('Reservations', () => {
    beforeAll(async () => {
        target = await getSupertestTarget()
        const admin = await loginAdmin()
        adminCookie = admin.cookie

        const email = `reservas.${uniqueCode('USR')}@example.com`
        const password = 'Test1234!'

        const reg = await request(target)
            .post('/api/sessions/register')
            .send({ firstName: 'Test', lastName: 'Reservas', email, password })
            .set('Accept', 'application/json')

        expect([200, 201, 409, 400]).toContain(reg.status)

        const login = await request(target)
            .post('/api/sessions/login')
            .send({ email, password })
            .set('Accept', 'application/json')

        expect(login.status).toBe(200)
        userCookie = buildCookieHeader(login.headers['set-cookie'])
        const token = getCookieValue(userCookie, 'token')
        userId = decodeJwtUserId(token) || await resolveCurrentUserId(userCookie)
        expect(typeof userId).toBe('string')

        const createLodging = await request(target)
            .post('/api/lodgings')
            .set('Cookie', adminCookie)
            .send({
                title: `Lodging ${uniqueCode('LG')}`,
                description: 'Test lodging with enough characters',
                images: [],
                location: { country: 'AR', province: 'Buenos Aires', city: 'Buenos Aires' },
                capacity: 2,
                pricing: { weekday: 100, weekend: 180, holiday: 250 },
                owner: admin.id || userId,
                isActive: true
            })

        expect(createLodging.status).toBeTypeOf('number')
        expect([200, 201]).toContain(createLodging.status)
        lodgingId = createLodging.body?.data?.id || createLodging.body?.data?._id
        expect(typeof lodgingId).toBe('string')
    })

    it('debería crear una reserva válida como usuario', async () => {
        const checkIn = futureISO(7)
        const checkOut = futureISO(10)
        const res = await request(target)
            .post('/api/reservations')
            .set('Cookie', userCookie)
            .send({ userId, lodgingId, checkIn, checkOut, guests: 2 })

        expect(res.status).toBeTypeOf('number')
        expect([200, 201]).toContain(res.status)
        expect(res.body?.status).toBe('success')
        expect(typeof res.body?.data?.id).toBe('string')
        expect(res.body?.data?.lodgingId).toBe(lodgingId)
        reservationId = res.body.data.id
    })

    it('debería rechazar crear reserva sin autenticación', async () => {
        const res = await request(target)
            .post('/api/reservations')
            .send({ userId, lodgingId, checkIn: futureISO(12), checkOut: futureISO(14), guests: 2 })

        expect([401, 403]).toContain(res.status)
    })

    it('debería obtener mis reservas en /user', async () => {
        const res = await request(target)
            .get('/api/reservations/user')
            .set('Cookie', userCookie)

        expect(res.status).toBe(200)
        expect(res.body?.status).toBe('success')
        expect(Array.isArray(res.body?.data)).toBe(true)
        expect(res.body.data.length).toBeGreaterThan(0)
    })

    it('debería permitir a admin listar reservas con paginación', async () => {
        const res = await request(target)
            .get('/api/reservations')
            .set('Cookie', adminCookie)
            .query({ page: 1, limit: 10 })

        expect(res.status).toBe(200)
        expect(res.body?.status).toBe('success')
        expect(Array.isArray(res.body?.data)).toBe(true)
        expect(typeof res.body?.total).toBe('number')
        expect(typeof res.body?.page).toBe('number')
        expect(typeof res.body?.pages).toBe('number')
    })

    it('debería permitir a admin ver summary por lodging', async () => {
        const res = await request(target)
            .get('/api/reservations/summary')
            .set('Cookie', adminCookie)
            .query({ lodgingId })

        expect(res.status).toBe(200)
        expect(res.body?.status).toBe('success')
        expect(res.body?.data).toBeTypeOf('object')
    })

    it('debería permitir a dueño ver su reserva por id', async () => {
        const res = await request(target)
            .get(`/api/reservations/${reservationId}`)
            .set('Cookie', userCookie)

        expect(res.status).toBe(200)
        expect(res.body?.status).toBe('success')
        expect(res.body?.data?.id).toBe(reservationId)
    })

    it('debería permitir a admin ver una reserva por id', async () => {
        const res = await request(target)
            .get(`/api/reservations/${reservationId}`)
            .set('Cookie', adminCookie)

        expect(res.status).toBe(200)
        expect(res.body?.status).toBe('success')
        expect(res.body?.data?.id).toBe(reservationId)
    })

    it('debería impedir ver una reserva ajena sin rol admin', async () => {
        const email = `otro.${uniqueCode('USR')}@example.com`
        const password = 'Reservas123*'
        const reg = await request(target).post('/api/sessions/register').send({ firstName: 'Otro', lastName: 'User', email, password })
        expect([200, 201, 409]).toContain(reg.status)
        const login = await request(target).post('/api/sessions/login').send({ email, password })
        expect(login.status).toBe(200)
        const strangerCookie = buildCookieHeader(login.headers['set-cookie'])

        const res = await request(target)
            .get(`/api/reservations/${reservationId}`)
            .set('Cookie', strangerCookie)

        expect([403, 401]).toContain(res.status)
    })

    it('debería permitir a admin borrar una reserva', async () => {
        const res = await request(target)
            .delete(`/api/reservations/${reservationId}`)
            .set('Cookie', adminCookie)

        expect([200, 204]).toContain(res.status)
    })
})
