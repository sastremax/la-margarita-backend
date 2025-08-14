import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { loginAdmin } from '../setup/auth.helper.js'
import { getSupertestTarget } from '../setup/server.helper.js'

describe('Products', () => {
    let agent
    let admin
    const createdIds = []
    const suffix = `${Date.now()}-${Math.floor(Math.random() * 100000)}`
    const baseBody = {
        title: `Test Product ${suffix}`,
        description: 'Functional test product',
        code: `CODE-${suffix}`,
        price: 123.45,
        stock: 10,
        status: true,
        category: 'service'
    }

    beforeAll(async () => {
        agent = request(await getSupertestTarget())
        admin = await loginAdmin()
    })

    afterAll(async () => {
        for (const id of createdIds) {
            try {
                await agent.delete(`/api/products/${id}`).set('Cookie', admin.cookie)
            } catch { }
        }
    })

    it('debería rechazar creación sin cookie', async () => {
        const res = await agent.post('/api/products').send(baseBody)
        expect([401, 403]).toContain(res.status)
    })

    it('debería crear producto con admin', async () => {
        const res = await agent.post('/api/products').set('Cookie', admin.cookie).send(baseBody)
        expect(res.status).toBe(201)
        expect(res.body.status).toBe('success')
        const p = res.body.data
        expect(p).toHaveProperty('id')
        expect(p).toHaveProperty('title', baseBody.title)
        expect(p).toHaveProperty('code', baseBody.code)
        expect(p).toHaveProperty('price', baseBody.price)
        expect(p).toHaveProperty('stock', baseBody.stock)
        expect(p).toHaveProperty('status', baseBody.status)
        expect(p).toHaveProperty('createdAt')
        expect(p).toHaveProperty('updatedAt')
        createdIds.push(p.id)
    })

    it('debería listar productos', async () => {
        const res = await agent.get('/api/products')
        expect(res.status).toBe(200)
        expect(res.body.status).toBe('success')
        expect(Array.isArray(res.body.data)).toBe(true)
        const any = res.body.data[0]
        if (any) {
            expect(any).toHaveProperty('id')
            expect(any).toHaveProperty('title')
            expect(any).toHaveProperty('code')
            expect(any).toHaveProperty('price')
            expect(any).toHaveProperty('stock')
            expect(any).toHaveProperty('status')
            expect(any).toHaveProperty('createdAt')
            expect(any).toHaveProperty('updatedAt')
        }
    })

    it('debería obtener producto por id', async () => {
        const pid = createdIds[0]
        const res = await agent.get(`/api/products/${pid}`)
        expect(res.status).toBe(200)
        const p = res.body.data
        expect(p).toHaveProperty('id', pid)
        expect(p).toHaveProperty('title')
        expect(p).toHaveProperty('code')
        expect(p).toHaveProperty('price')
        expect(p).toHaveProperty('stock')
        expect(p).toHaveProperty('status')
        expect(p).toHaveProperty('createdAt')
        expect(p).toHaveProperty('updatedAt')
    })

    it('debería actualizar producto', async () => {
        const pid = createdIds[0]
        const update = { title: `Producto Actualizado ${suffix}`, price: 222.22, stock: 7 }
        let res = await agent.patch(`/api/products/${pid}`).set('Cookie', admin.cookie).send(update)
        if (res.status === 404 || res.status === 405) {
            res = await agent.put(`/api/products/${pid}`).set('Cookie', admin.cookie).send(update)
        }
        expect([200, 204]).toContain(res.status)
        const getRes = await agent.get(`/api/products/${pid}`)
        expect(getRes.status).toBe(200)
        const p = getRes.body.data
        expect(p.title).toBe(update.title)
        expect(p.price).toBe(update.price)
        expect(p.stock).toBe(update.stock)
    })

    it('debería eliminar producto', async () => {
        const createRes = await agent.post('/api/products').set('Cookie', admin.cookie).send({
            ...baseBody,
            title: `Test Product Delete ${suffix}`,
            code: `CODE-DEL-${suffix}`
        })
        expect(createRes.status).toBe(201)
        const pid = createRes.body.data.id
        createdIds.push(pid)
        const delRes = await agent.delete(`/api/products/${pid}`).set('Cookie', admin.cookie)
        expect([200, 204]).toContain(delRes.status)
        const getRes = await agent.get(`/api/products/${pid}`)
        expect([404, 410]).toContain(getRes.status)
        createdIds.splice(createdIds.indexOf(pid), 1)
    })
})
