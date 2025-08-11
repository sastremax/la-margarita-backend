import { describe, expect, it } from 'vitest'
import { passwordSchema } from '../../../src/dto/common.schema.js'
import { userSchemaGoogle, userSchemaRegister } from '../../../src/dto/user.schema.js'

describe('passwordSchema', () => {
    it('debería aceptar un password válido', () => {
        const ok = 'Abcd1234!'
        expect(passwordSchema.parse(ok)).toBe(ok)
    })

    it('debería rechazar passwords inválidos por longitud o composición', () => {
        expect(() => passwordSchema.parse('short1!')).toThrow()
        expect(() => passwordSchema.parse('abcdefgh')).toThrow()
        expect(() => passwordSchema.parse('12345678!')).toThrow()
        expect(() => passwordSchema.parse('Abcd1234')).toThrow()
    })
})

describe('userSchemaRegister', () => {
    it('debería validar registro con coerción de age y passwordSchema', () => {
        const data = {
            firstName: ' Ana ',
            lastName: ' Pérez ',
            email: 'ana@example.com',
            password: 'Abcd1234!',
            age: '30',
            role: 'user'
        }
        const parsed = userSchemaRegister.parse(data)
        expect(parsed.firstName).toBe('Ana')
        expect(parsed.lastName).toBe('Pérez')
        expect(parsed.age).toBe(30)
        expect(parsed.role).toBe('user')
    })

    it('debería rechazar role inválido y email inválido', () => {
        const badRole = {
            firstName: 'Ana',
            lastName: 'Pérez',
            email: 'ana@example.com',
            password: 'Abcd1234!',
            role: 'manager'
        }
        const badEmail = {
            firstName: 'Ana',
            lastName: 'Pérez',
            email: 'no-email',
            password: 'Abcd1234!'
        }
        expect(() => userSchemaRegister.parse(badRole)).toThrow()
        expect(() => userSchemaRegister.parse(badEmail)).toThrow()
    })
})

describe('userSchemaGoogle', () => {
    it('debería validar datos de Google con age opcional', () => {
        const data = {
            firstName: 'Juan',
            lastName: 'García',
            email: 'juan@example.com',
            role: 'admin'
        }
        const parsed = userSchemaGoogle.parse(data)
        expect(parsed.role).toBe('admin')
        expect(parsed.age).toBeUndefined()
    })

    it('debería coercionar age cuando viene como string', () => {
        const parsed = userSchemaGoogle.parse({
            firstName: 'Luz',
            lastName: 'Ramos',
            email: 'luz@example.com',
            age: '22'
        })
        expect(parsed.age).toBe(22)
    })
})
