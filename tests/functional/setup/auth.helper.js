import request from 'supertest'
import { getSupertestTarget } from './server.helper.js'

export const loginAdmin = async () => {
    const target = await getSupertestTarget()

    const candidates = [
        { method: 'post', url: '/api/sessions/login', body: { email: 'maxi@example.com', password: '12345678' } },
        { method: 'post', url: '/api/auth/login', body: { email: 'maxi@example.com', password: '12345678' } }
    ]

    let last = null
    for (const c of candidates) {
        const r = await request(target)[c.method](c.url).send(c.body).set('Accept', 'application/json')
        last = r
        if (r.status === 200 && r.headers['set-cookie']) {
            const cookie = Array.isArray(r.headers['set-cookie']) ? r.headers['set-cookie'][0] : r.headers['set-cookie']
            return { res: r, cookie }
        }
        if (r.status !== 404) break
    }

    const detail = last ? JSON.stringify(last.body || {}, null, 2) : 'no response'
    const status = last ? last.status : 'no-status'
    throw new Error(`Login failed with status ${status}. Body: ${detail}`)
}
