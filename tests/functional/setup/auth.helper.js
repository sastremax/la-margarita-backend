import request from 'supertest'
import { getSupertestTarget } from './server.helper.js'

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

const extractAnyTokenFromCookieHeader = (cookieHeader) => {
    const keys = ['token', 'jwt', 'access_token', 'authorization', 'auth_token']
    for (const k of keys) {
        const v = getCookieValue(cookieHeader, k)
        if (v) return v
    }
    return null
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

const tryResolveCurrentUserId = async (target, cookie) => {
    const candidates = [
        { m: 'get', u: '/api/sessions/current' },
        { m: 'get', u: '/api/auth/current' },
        { m: 'get', u: '/api/users/me' },
        { m: 'get', u: '/api/users/current' },
        { m: 'get', u: '/api/me' },
        { m: 'get', u: '/api/profile' }
    ]
    for (const c of candidates) {
        try {
            const r = await request(target)[c.m](c.u).set('Cookie', cookie)
            if (r.status !== 200) continue
            const b = r.body || {}
            const paths = [
                ['data', 'id'], ['data', '_id'], ['data', 'user', 'id'], ['data', 'user', '_id'],
                ['user', 'id'], ['user', '_id'], ['id'], ['_id']
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

export const loginAdmin = async () => {
    const target = await getSupertestTarget()

    const email = process.env.ADMIN_EMAIL
    const password = process.env.ADMIN_PASSWORD
    if (!email || !password) {
        throw new Error('Missing ADMIN_EMAIL or ADMIN_PASSWORD in environment')
    }

    const logins = [
        { method: 'post', url: '/api/sessions/login', body: { email, password } },
        { method: 'post', url: '/api/auth/login', body: { email, password } }
    ]

    let last = null
    for (const c of logins) {
        const r = await request(target)[c.method](c.url).send(c.body).set('Accept', 'application/json')
        last = r
        if (r.status === 200 && r.headers['set-cookie']) {
            const cookie = buildCookieHeader(r.headers['set-cookie'])
            const token = extractAnyTokenFromCookieHeader(cookie)
            let id = decodeJwtUserId(token)
            if (!id) id = await tryResolveCurrentUserId(target, cookie)
            return { res: r, cookie, token, id }
        }
        if (r.status !== 404) break
    }

    const detail = last ? JSON.stringify(last.body || {}, null, 2) : 'no response'
    const status = last ? last.status : 'no-status'
    throw new Error(`Login failed with status ${status}. Body: ${detail}`)
}
