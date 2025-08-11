import { describe, expect, it } from 'vitest'
import { asPublicProduct, productSchema } from '../../../src/dto/product.dto.js'

describe('productSchema', () => {
    it('debería validar y coercionar price y stock', () => {
        const data = {
            title: 'Desayuno',
            description: 'Combo',
            price: '12.5',
            code: 'BRK-01',
            category: 'food',
            stock: '3',
            images: ['https://example.com/a.jpg']
        }
        const parsed = productSchema.parse(data)
        expect(parsed.price).toBe(12.5)
        expect(parsed.stock).toBe(3)
    })

    it('debería rechazar category inválida y code fuera de regex', () => {
        const badCat = {
            title: 'x',
            description: 'y',
            price: 10,
            code: 'OK-1',
            category: 'tool',
            stock: 0
        }
        const badCode = {
            title: 'x',
            description: 'y',
            price: 10,
            code: 'inv@lid',
            category: 'food',
            stock: 0
        }
        expect(() => productSchema.parse(badCat)).toThrow()
        expect(() => productSchema.parse(badCode)).toThrow()
    })
})

describe('asPublicProduct', () => {
    it('debería devolver null si product es falsy', () => {
        expect(asPublicProduct(null)).toBeNull()
        expect(asPublicProduct(undefined)).toBeNull()
    })

    it('debería normalizar id a string y mantener fields', () => {
        const prod = {
            _id: { toString: () => 'p1' },
            title: 'Desayuno',
            description: 'Combo',
            price: 12.5,
            code: 'BRK-01',
            category: 'food',
            stock: 3,
            images: ['https://example.com/a.jpg']
        }
        const dto = asPublicProduct(prod)
        expect(dto).toEqual({
            id: 'p1',
            title: 'Desayuno',
            description: 'Combo',
            price: 12.5,
            code: 'BRK-01',
            category: 'food',
            stock: 3,
            images: ['https://example.com/a.jpg']
        })
    })

    it('debería tolerar id como string y defaults seguros en images', () => {
        const prod = {
            _id: 'p2',
            title: 'Servicio',
            description: 'Limpieza',
            price: 30,
            code: 'SRV_10',
            category: 'service',
            stock: 0
        }
        const dto = asPublicProduct(prod)
        expect(dto.id).toBe('p2')
        expect(dto.images).toEqual([])
    })
})
