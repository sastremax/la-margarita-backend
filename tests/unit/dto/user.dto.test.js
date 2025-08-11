import { describe, expect, it } from 'vitest'
import { asUserPublic } from '../../../src/dto/user.dto.js'

describe('asUserPublic', () => {
    it('debería devolver null si user es falsy', () => {
        expect(asUserPublic(null)).toBeNull()
        expect(asUserPublic(undefined)).toBeNull()
    })

    it('debería mapear campos y normalizar ids a string', () => {
        const user = {
            _id: { toString: () => 'u1' },
            firstName: 'Max',
            lastName: 'Power',
            email: 'max@example.com',
            role: 'admin',
            cart: { _id: { toString: () => 'c1' } }
        }
        const result = asUserPublic(user)
        expect(result).toEqual({
            id: 'u1',
            fullName: 'Max Power',
            email: 'max@example.com',
            role: 'admin',
            cartId: 'c1'
        })
    })

    it('debería manejar cart como string o poblado', () => {
        const u1 = {
            _id: 'u2',
            firstName: 'Ana',
            lastName: 'Lee',
            email: 'ana@example.com',
            role: 'user',
            cart: 'c2'
        }
        const r1 = asUserPublic(u1)
        expect(r1.id).toBe('u2')
        expect(r1.cartId).toBe('c2')

        const u2 = {
            _id: 'u3',
            firstName: 'Ana',
            lastName: 'Lee',
            email: 'ana@example.com',
            role: 'user',
            cart: { _id: { toString: () => 'c3' } }
        }
        const r2 = asUserPublic(u2)
        expect(r2.id).toBe('u3')
        expect(r2.cartId).toBe('c3')
    })

    it('debería construir fullName sin espacios extra cuando falta lastName', () => {
        const user = {
            _id: 'u4',
            firstName: 'Solo',
            email: 'solo@example.com',
            role: 'user'
        }
        const result = asUserPublic(user)
        expect(result.fullName).toBe('Solo')
    })

    it('debería devolver nulls seguros cuando faltan campos', () => {
        const user = { _id: { toString: () => 'u5' } }
        const result = asUserPublic(user)
        expect(result).toEqual({
            id: 'u5',
            fullName: '',
            email: null,
            role: null,
            cartId: null
        })
    })
})
