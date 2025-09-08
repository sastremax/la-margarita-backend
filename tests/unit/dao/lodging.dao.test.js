import mongoose from 'mongoose'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { connectToDB } from '../../../src/config/db.js'
import { LodgingDAO } from '../../../src/dao/lodging.dao.js'
import Lodging from '../../../src/models/lodging.model.js'
import UserModel from '../../../src/models/user.model.js'

describe('LodgingDAO', () => {
    const dao = new LodgingDAO()
    const unique = Date.now().toString()
    let owner
    let l1
    let l2
    let l3

    beforeAll(async () => {
        await connectToDB()
        owner = await UserModel.create({
            firstName: 'Owner',
            lastName: 'Test',
            email: `owner_${unique}@example.com`,
            password: 'Admin$12345',
            role: 'user'
        })
        l1 = await dao.createLodging({
            title: `Casa A ${unique}`,
            description: 'Descripcion valida para lodging A',
            images: ['https://example.com/a.jpg'],
            location: { country: 'Argentina', province: 'Buenos Aires', city: 'La Plata' },
            capacity: 4,
            pricing: { weekday: 100, weekend: 150 },
            ownerId: owner._id,
            isActive: true
        })
        l2 = await dao.createLodging({
            title: `Casa B ${unique}`,
            description: 'Descripcion valida para lodging B',
            images: ['https://example.com/b.jpg'],
            location: { country: 'Argentina', province: 'Cordoba', city: 'Cordoba' },
            capacity: 6,
            pricing: { weekday: 120, weekend: 170 },
            ownerId: owner._id,
            isActive: false
        })
        l3 = await dao.createLodging({
            title: `Casa C ${unique}`,
            description: 'Descripcion valida para lodging C',
            images: ['https://example.com/c.jpg'],
            location: { country: 'Uruguay', province: 'Maldonado', city: 'Punta' },
            capacity: 2,
            pricing: { weekday: 90, weekend: 140 },
            ownerId: owner._id,
            isActive: true
        })
    })

    afterAll(async () => {
        await Lodging.deleteMany({ owner: owner._id })
        await UserModel.deleteOne({ _id: owner._id })
        await mongoose.disconnect()
    })

    it('debería listar todos ordenados por createdAt desc', async () => {
        const all = await dao.getAllLodgings({})
        expect(all.length).toBeGreaterThanOrEqual(3)
        for (let i = 1; i < all.length; i++) {
            expect(all[i - 1].createdAt.getTime()).toBeGreaterThanOrEqual(all[i].createdAt.getTime())
        }
    })

    it('debería filtrar por city', async () => {
        const res = await dao.getAllLodgings({ city: 'La Plata' })
        expect(res.every(x => x.location.city === 'La Plata')).toBe(true)
    })

    it('debería filtrar por province', async () => {
        const res = await dao.getAllLodgings({ province: 'Cordoba' })
        expect(res.length).toBeGreaterThanOrEqual(1)
        expect(res.every(x => x.location.province === 'Cordoba')).toBe(true)
    })

    it('debería filtrar por country', async () => {
        const res = await dao.getAllLodgings({ country: 'Uruguay' })
        expect(res.length).toBe(1)
        expect(res[0]._id.toString()).toBe(l3._id.toString())
    })

    it('debería filtrar por owner', async () => {
        const res = await dao.getAllLodgings({ owner: owner._id.toString() })
        expect(res.length).toBeGreaterThanOrEqual(3)
        expect(res.every(x => x.owner.toString() === owner._id.toString())).toBe(true)
    })

    it('debería lanzar error con owner inválido en filtros', async () => {
        await expect(dao.getAllLodgings({ owner: 'invalid-id' })).rejects.toThrow('Invalid owner ID')
    })

    it('debería filtrar por isActive=true y isActive=false', async () => {
        const actives = await dao.getAllLodgings({ isActive: 'true' })
        expect(actives.every(x => x.isActive === true)).toBe(true)
        const inactives = await dao.getAllLodgings({ isActive: 'false' })
        expect(inactives.every(x => x.isActive === false)).toBe(true)
    })

    it('debería filtrar por capacity mínima', async () => {
        const res = await dao.getAllLodgings({ capacity: '5' })
        expect(res.every(x => x.capacity >= 5)).toBe(true)
    })

    it('debería obtener por id', async () => {
        const found = await dao.getLodgingById(l1._id.toString())
        expect(found).toBeTruthy()
        expect(found.title).toBe(l1.title)
    })

    it('debería lanzar error con id inválido en getLodgingById', async () => {
        await expect(dao.getLodgingById('invalid-id')).rejects.toThrow('Invalid lodging ID')
    })

    it('debería obtener por owner', async () => {
        const res = await dao.getLodgingsByOwner(owner._id.toString())
        expect(res.length).toBeGreaterThanOrEqual(3)
    })

    it('debería lanzar error con owner inválido en getLodgingsByOwner', async () => {
        await expect(dao.getLodgingsByOwner('invalid-id')).rejects.toThrow('Invalid owner ID')
    })

    it('debería actualizar un lodging', async () => {
        const updated = await dao.updateLodging(l2._id.toString(), { title: `Casa B ${unique} Edit` })
        expect(updated).toBeTruthy()
        expect(updated.title).toBe(`Casa B ${unique} Edit`)
    })

    it('debería lanzar error con id inválido en updateLodging', async () => {
        await expect(dao.updateLodging('invalid-id', { title: 'X' })).rejects.toThrow('Invalid lodging ID')
    })

    it('debería deshabilitar un lodging', async () => {
        const disabled = await dao.disableLodging(l1._id.toString())
        expect(disabled).toBeTruthy()
        expect(disabled.isActive).toBe(false)
    })

    it('debería lanzar error con id inválido en disableLodging', async () => {
        await expect(dao.disableLodging('invalid-id')).rejects.toThrow('Invalid lodging ID')
    })

    it('debería eliminar un lodging', async () => {
        const temp = await dao.createLodging({
            title: `Temp ${unique}`,
            description: 'Descripcion valida para eliminar',
            images: ['https://example.com/t.jpg'],
            location: { country: 'Argentina', province: 'Santa Fe', city: 'Rosario' },
            capacity: 3,
            pricing: { weekday: 110, weekend: 160 },
            ownerId: owner._id,
            isActive: true
        })
        const deleted = await dao.deleteLodging(temp._id.toString())
        expect(deleted).toBeTruthy()
        const check = await Lodging.findById(temp._id)
        expect(check).toBeNull()
    })

    it('debería lanzar error con id inválido en deleteLodging', async () => {
        await expect(dao.deleteLodging('invalid-id')).rejects.toThrow('Invalid lodging ID')
    })
})
