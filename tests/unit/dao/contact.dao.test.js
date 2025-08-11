import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import mongoose from 'mongoose'
import { connectToDB } from '../../../src/config/db.js'
import ContactModel from '../../../src/models/contact.model.js'
import { ContactDAO } from '../../../src/dao/contact.dao.js'

describe('ContactDAO', () => {
    const dao = new ContactDAO()
    const unique = Date.now().toString()
    let contactA
    let contactB

    beforeAll(async () => {
        await connectToDB()
        contactA = await dao.createContact({
            name: 'Tester A',
            email: `a_${unique}@example.com`,
            message: 'Mensaje de prueba A'
        })
        await new Promise(r => setTimeout(r, 5))
        contactB = await dao.createContact({
            name: 'Tester B',
            email: `b_${unique}@example.com`,
            message: 'Mensaje de prueba B'
        })
    })

    afterAll(async () => {
        await ContactModel.deleteMany({ email: { $in: [`a_${unique}@example.com`, `b_${unique}@example.com`, `upd_${unique}@example.com`] } })
        await mongoose.disconnect()
    })

    it('debería crear un contacto', async () => {
        expect(contactA).toBeTruthy()
        expect(contactA.email).toBe(`a_${unique}@example.com`)
        expect(contactA.replied).toBe(false)
        expect(typeof contactA.createdAt).toBe('object')
    })

    it('debería listar contactos ordenados por createdAt descendente', async () => {
        const all = await dao.getAllContacts()
        expect(all.length).toBeGreaterThanOrEqual(2)
        for (let i = 1; i < all.length; i++) {
            expect(all[i - 1].createdAt.getTime()).toBeGreaterThanOrEqual(all[i].createdAt.getTime())
        }
    })

    it('debería obtener un contacto por id', async () => {
        const found = await dao.getContactById(contactA._id.toString())
        expect(found).toBeTruthy()
        expect(found.email).toBe(`a_${unique}@example.com`)
    })

    it('debería lanzar error con id inválido al obtener', async () => {
        await expect(dao.getContactById('invalid-id')).rejects.toThrow('Invalid contact ID')
    })

    it('debería actualizar replied y replyNote', async () => {
        const updated = await dao.updateReplyStatus(contactB._id.toString(), { replied: true, replyNote: 'Respondido' })
        expect(updated).toBeTruthy()
        expect(updated.replied).toBe(true)
        expect(updated.replyNote).toBe('Respondido')
    })

    it('debería lanzar error con id inválido al actualizar', async () => {
        await expect(dao.updateReplyStatus('invalid-id', { replied: true, replyNote: 'X' })).rejects.toThrow('Invalid contact ID')
    })

    it('debería eliminar un contacto', async () => {
        const temp = await dao.createContact({
            name: 'Temp',
            email: `upd_${unique}@example.com`,
            message: 'Mensaje válido para eliminar'
        })
        const deleted = await dao.deleteContact(temp._id.toString())
        expect(deleted).toBeTruthy()
        const check = await ContactModel.findById(temp._id)
        expect(check).toBeNull()
    })

    it('debería lanzar error con id inválido al eliminar', async () => {
        await expect(dao.deleteContact('invalid-id')).rejects.toThrow('Invalid contact ID')
    })
})
