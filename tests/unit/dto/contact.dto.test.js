import { describe, expect, it } from 'vitest'
import { contactDTO } from '../../../src/dto/contact.dto.js'

const { asPublicContact, contactSchema, replySchema } = contactDTO

describe('contactSchema', () => {
    it('debería validar nombre, email y message mínimos', () => {
        const data = { name: 'Ana', email: 'ana@example.com', message: 'Mensaje válido con más de 10' }
        const parsed = contactSchema.parse(data)
        expect(parsed).toEqual(data)
    })

    it('debería rechazar email inválido y message corto', () => {
        expect(() => contactSchema.parse({ name: 'A', email: 'no-email', message: 'corto' })).toThrow()
    })
})

describe('replySchema', () => {
    it('debería validar replied y replyNote opcional', () => {
        const parsed = replySchema.parse({ replied: true, replyNote: 'Gracias por contactarnos' })
        expect(parsed.replied).toBe(true)
        expect(parsed.replyNote).toBe('Gracias por contactarnos')
    })

    it('debería permitir replyNote ausente', () => {
        const parsed = replySchema.parse({ replied: false })
        expect(parsed.replied).toBe(false)
        expect(parsed.replyNote).toBeUndefined()
    })
})

describe('asPublicContact', () => {
    it('debería devolver null si contact es falsy', () => {
        expect(asPublicContact(null)).toBeNull()
        expect(asPublicContact(undefined)).toBeNull()
    })

    it('debería normalizar id y serializar fechas ISO', () => {
        const contact = {
            _id: { toString: () => 'c1' },
            name: 'Ana',
            email: 'ana@example.com',
            message: 'Hola, quiero info',
            replied: true,
            replyNote: 'Respondido',
            createdAt: new Date('2025-08-10T00:00:00.000Z'),
            updatedAt: new Date('2025-08-11T00:00:00.000Z')
        }
        const dto = asPublicContact(contact)
        expect(dto).toEqual({
            id: 'c1',
            name: 'Ana',
            email: 'ana@example.com',
            message: 'Hola, quiero info',
            replied: true,
            replyNote: 'Respondido',
            createdAt: '2025-08-10T00:00:00.000Z',
            updatedAt: '2025-08-11T00:00:00.000Z'
        })
    })

    it('debería usar defaults seguros cuando faltan campos', () => {
        const contact = { _id: 'c2', name: 'Beto', email: 'b@e.com', message: 'Mensaje' }
        const dto = asPublicContact(contact)
        expect(dto.id).toBe('c2')
        expect(dto.replied).toBe(false)
        expect(dto.replyNote).toBe('')
        expect(dto.createdAt).toBeNull()
        expect(dto.updatedAt).toBeNull()
    })
})
