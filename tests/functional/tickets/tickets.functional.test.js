import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { loginAdmin } from '../setup/auth.helper.js'
import { uniqueCode } from '../setup/data.helper.js'
import { getSupertestTarget } from '../setup/server.helper.js'

describe('Tickets', () => {
    let agent
    let admin
    let productId
    let cartId

    beforeAll(async () => {
        const app = await getSupertestTarget()
        agent = request(app)
        admin = await loginAdmin()
    })

    afterAll(async () => {
        try {
            if (cartId) await agent.delete(`/api/carts/${cartId}`).set('Cookie', admin.cookie)
        } catch { }
        try {
            if (productId) await agent.delete(`/api/products/${productId}`).set('Cookie', admin.cookie)
        } catch { }
    })

    it('debería crear un ticket al comprar un carrito', async () => {
        const body = {
            title: `Producto Ticket ${Date.now()}`,
            description: 'Producto para generar ticket',
            code: uniqueCode('TKT'),
            price: 123.45,
            stock: 50,
            status: true,
            category: 'food'
        }

        let res = await agent.post('/api/products').set('Cookie', admin.cookie).send(body)
        expect(res.status).toBe(201)
        expect(res.body?.status).toBe('success')
        productId = res.body?.data?.id

        res = await agent.post('/api/carts').set('Cookie', admin.cookie)
        expect([200, 201]).toContain(res.status)
        expect(res.body?.status).toBe('success')
        cartId = res.body?.data?.id

        res = await agent
            .post(`/api/carts/${cartId}/products/${productId}`)
            .set('Cookie', admin.cookie)
            .send({ productId, quantity: 1 })
        expect([200, 201, 204]).toContain(res.status)

        res = await agent.post(`/api/carts/${cartId}/purchase`).set('Cookie', admin.cookie)
        expect([200, 201, 202]).toContain(res.status)
        expect(res.body?.status).toBe('success')

        const t = res.body?.data
        expect(typeof t.code).toBe('string')
        expect(t.code.length).toBeGreaterThan(8)
        expect(typeof t.purchaser).toBe('string')
        expect(t.purchaser.length).toBeGreaterThan(2)
        expect(typeof t.amount).toBe('number')
        expect(t.amount).toBeGreaterThan(0)
        expect(Array.isArray(t.products)).toBe(true)
        expect(t.products.length).toBeGreaterThan(0)
        const item = t.products[0]
        expect(typeof item.quantity).toBe('number')
        expect(item.quantity).toBeGreaterThan(0)
        expect(item.product && typeof item.product).toBe('object')
        expect(typeof item.product.title).toBe('string')
        expect(typeof item.product.price).toBe('number')
        expect(t.createdAt || t.created_at).toBeDefined()
    })

    it('no debería generar un ticket al comprar un carrito vacío', async () => {
        const resCart = await agent.post('/api/carts').set('Cookie', admin.cookie)
        expect([200, 201]).toContain(resCart.status)
        const emptyCartId = resCart.body?.data?.id

        const res = await agent.post(`/api/carts/${emptyCartId}/purchase`).set('Cookie', admin.cookie)
        expect(res.status).toBe(400)
        expect(res.body?.status).toBe('error')
        expect(res.body?.message || '').toMatch(/empty|vacío|productos/i)
    })
})