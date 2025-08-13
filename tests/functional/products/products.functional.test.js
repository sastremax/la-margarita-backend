import { describe, it, expect } from 'vitest'
import { api } from '../setup/server.helper.js'

function uniqueCode(prefix = 'PRD') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

let adminCookie

describe('Products', () => {
    it('debería crear producto como admin', async () => {
        const login = await api.post('/api/sessions/login').send({ email: 'maxi@example.com', password: '12345678' })
        adminCookie = login.headers['set-cookie']?.find(c => c.startsWith('accessToken='))
        const payload = { title: 'Test Product', description: 'X', price: 10, stock: 5, code: uniqueCode() }
        const res = await api.post('/api/products').set('Cookie', adminCookie).send(payload)
        expect(res.status).toBe(201)
        expect(res.body?.data?.id).toBeTruthy()
    })

    it('debería listar productos', async () => {
        const res = await api.get('/api/products')
        expect(res.status).toBe(200)
        expect(Array.isArray(res.body?.data)).toBe(true)
    })
})
