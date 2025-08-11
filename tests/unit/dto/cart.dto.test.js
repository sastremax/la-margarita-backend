import { describe, expect, it } from 'vitest'
import { asPublicCart, cartItemSchema, cartSchema } from '../../../src/dto/cart.dto.js'

describe('cartItemSchema', () => {
    it('debería coerces quantity a número entero positivo', () => {
        const parsed = cartItemSchema.parse({ productId: 'p1', quantity: '2' })
        expect(parsed.quantity).toBe(2)
    })

    it('debería rechazar quantity inválida', () => {
        expect(() => cartItemSchema.parse({ productId: 'p1', quantity: 0 })).toThrow()
        expect(() => cartItemSchema.parse({ productId: 'p1', quantity: -1 })).toThrow()
    })
})

describe('cartSchema', () => {
    it('debería validar lista mínima de items', () => {
        const parsed = cartSchema.parse({ items: [{ productId: 'p1', quantity: 1 }] })
        expect(parsed.items.length).toBe(1)
    })

    it('debería rechazar items vacíos', () => {
        expect(() => cartSchema.parse({ items: [] })).toThrow()
    })
})

describe('asPublicCart', () => {
    it('debería devolver null si cart es falsy', () => {
        expect(asPublicCart(null)).toBeNull()
        expect(asPublicCart(undefined)).toBeNull()
    })

    it('debería normalizar id y userId a string', () => {
        const cart = {
            _id: { toString: () => 'c1' },
            user: { _id: { toString: () => 'u1' } },
            products: []
        }
        const dto = asPublicCart(cart)
        expect(dto.id).toBe('c1')
        expect(dto.userId).toBe('u1')
    })

    it('debería mapear products con documentos poblados', () => {
        const cart = {
            _id: 'c2',
            user: 'u2',
            products: [
                {
                    product: { _id: { toString: () => 'p1' }, title: 'A', price: 10 },
                    quantity: 3
                }
            ]
        }
        const dto = asPublicCart(cart)
        expect(dto.products).toEqual([
            { productId: 'p1', title: 'A', price: 10, quantity: 3 }
        ])
    })

    it('debería mapear products con ids simples y defaults seguros', () => {
        const cart = {
            _id: 'c3',
            user: 'u3',
            products: [
                { product: 'p2', quantity: 1 },
                { product: { _id: 'p3', price: NaN }, quantity: 2 }
            ]
        }
        const dto = asPublicCart(cart)
        expect(dto.products[0]).toEqual({ productId: 'p2', title: '', price: 0, quantity: 1 })
        expect(dto.products[1]).toEqual({ productId: 'p3', title: '', price: 0, quantity: 2 })
    })

    it('debería devolver products vacío cuando no hay array', () => {
        const cart = { _id: 'c4', user: 'u4' }
        const dto = asPublicCart(cart)
        expect(dto.products).toEqual([])
    })
})
