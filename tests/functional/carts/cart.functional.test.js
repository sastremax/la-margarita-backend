import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import crypto from 'crypto'
import { loginAdmin } from '../setup/auth.helper.js'
import { getServer } from '../setup/server.helper.js'

describe('Carts', () => {
    let server
    let agent
    let admin
    let productId = null
    let cartId = null
    const skipCleanup = String(process.env.SKIP_FUNC_CLEANUP || '') === '1' || String(process.env.SKIP_FUNC_CLEANUP || '').toLowerCase() === 'true'

    beforeAll(async () => {
        server = await getServer()
        agent = request(server)
        admin = await loginAdmin(agent)

        const code = `T-${Date.now().toString(36)}-${crypto.randomBytes(4).toString('hex')}`
        const productBody = {
            title: 'Test Product',
            description: 'Test product description',
            code,
            price: 199.99,
            stock: 25,
            category: 'food',
            status: true
        }

        const p = await agent.post('/api/products').set('Cookie', admin.cookie).send(productBody)
        if (p.status !== 201) throw new Error(`Fallo al crear producto: ${p.status} ${JSON.stringify(p.body)}`)
        productId = p.body?.data?.id
        if (!productId) throw new Error('Producto creado sin id')
    })

    afterAll(async () => {
        if (skipCleanup) return
        try {
            if (cartId) await agent.delete(`/api/carts/${cartId}`).set('Cookie', admin.cookie)
        } catch { }
        try {
            if (productId) await agent.delete(`/api/products/${productId}`).set('Cookie', admin.cookie)
        } catch { }
    })

    it('debería crear un carrito', async () => {
        const res = await agent.post('/api/carts').set('Cookie', admin.cookie)
        if (![200, 201].includes(res.status)) throw new Error(`Crear carrito falló: ${res.status} ${JSON.stringify(res.body)}`)
        const data = res.body?.data || {}
        expect(data).toBeTypeOf('object')
        expect(data).toHaveProperty('id')
        cartId = data.id
    })

    it('debería obtener el carrito por id', async () => {
        const res = await agent.get(`/api/carts/${cartId}`).set('Cookie', admin.cookie)
        if (res.status !== 200) throw new Error(`Get carrito falló: ${res.status} ${JSON.stringify(res.body)}`)
        const c = res.body.data
        expect(c).toHaveProperty('id', cartId)
        expect(Array.isArray(c.products)).toBe(true)
    })

    it('debería agregar un producto al carrito', async () => {
        const res = await agent
            .post(`/api/carts/${cartId}/products/${productId}`)
            .set('Cookie', admin.cookie)
            .send({ productId, quantity: 1 })
        if (![200, 201].includes(res.status)) throw new Error(`Agregar producto falló: ${res.status} ${JSON.stringify(res.body)}`)
        const c = res.body.data || {}
        expect(Array.isArray(c.products)).toBe(true)
    })

    it('debería actualizar cantidad del producto en el carrito', async () => {
        let res = await agent
            .patch(`/api/carts/${cartId}/products/${productId}`)
            .set('Cookie', admin.cookie)
            .send({ quantity: 2 })
        if ([404, 405].includes(res.status)) {
            res = await agent
                .put(`/api/carts/${cartId}/products/${productId}`)
                .set('Cookie', admin.cookie)
                .send({ quantity: 2 })
        }
        if (![200, 204].includes(res.status)) throw new Error(`Actualizar cantidad falló: ${res.status} ${JSON.stringify(res.body)}`)
        const getRes = await agent.get(`/api/carts/${cartId}`).set('Cookie', admin.cookie)
        if (getRes.status !== 200) throw new Error(`Releer carrito falló: ${getRes.status} ${JSON.stringify(getRes.body)}`)
        const c = getRes.body.data
        const item = (c.products || []).find(i => (i.product?.id || i.product) === productId)
        const q = item?.quantity ?? item?.qty ?? item?.count
        expect(q).toBe(2)
    })

    it('debería remover un producto del carrito', async () => {
        const res = await agent.delete(`/api/carts/${cartId}/products/${productId}`).set('Cookie', admin.cookie)
        if (![200, 204].includes(res.status)) throw new Error(`Remover producto falló: ${res.status} ${JSON.stringify(res.body)}`)
        const getRes = await agent.get(`/api/carts/${cartId}`).set('Cookie', admin.cookie)
        if (getRes.status !== 200) throw new Error(`Releer carrito falló: ${getRes.status} ${JSON.stringify(getRes.body)}`)
        const exists = (getRes.body.data.products || []).some(i => (i.product?.id || i.product) === productId)
        expect(exists).toBe(false)
    })

    it('debería comprar el carrito', async () => {
        await agent
            .post(`/api/carts/${cartId}/products/${productId}`)
            .set('Cookie', admin.cookie)
            .send({ productId, quantity: 1 })
        const res = await agent.post(`/api/carts/${cartId}/purchase`).set('Cookie', admin.cookie)
        if (![200, 201, 202].includes(res.status)) throw new Error(`Purchase falló: ${res.status} ${JSON.stringify(res.body)}`)
        expect(res.body).toBeTypeOf('object')
        expect(res.body.status).toBeDefined()
    })

    it('debería eliminar el carrito', async () => {
        const res = await agent.delete(`/api/carts/${cartId}`).set('Cookie', admin.cookie)
        if (![200, 204].includes(res.status)) throw new Error(`Eliminar carrito falló: ${res.status} ${JSON.stringify(res.body)}`)
        const getRes = await agent.get(`/api/carts/${cartId}`).set('Cookie', admin.cookie)
        expect([404, 410]).toContain(getRes.status)
        if (!skipCleanup) cartId = null
    })
})
