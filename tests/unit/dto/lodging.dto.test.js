import { describe, expect, it } from 'vitest'
import { asPublicLodging, lodgingSchema } from '../../../src/dto/lodging.dto.js'

describe('lodgingSchema', () => {
    it('debería validar payload correcto y coercionar números', () => {
        const data = {
            title: 'Casa de Campo',
            description: 'Hermosa casa con parque y pileta',
            images: ['https://example.com/a.jpg'],
            location: { country: 'Argentina', province: 'BA', city: 'Tandil' },
            capacity: '6',
            pricing: { weekday: '100', weekend: 150 },
            owner: 'u1',
            isActive: true
        }
        const parsed = lodgingSchema.parse(data)
        expect(parsed.capacity).toBe(6)
        expect(parsed.pricing.weekday).toBe(100)
        expect(parsed.pricing.weekend).toBe(150)
        expect(parsed.pricing.holiday).toBeUndefined()
    })

    it('debería rechazar pricing sin weekday o weekend', () => {
        const bad1 = {
            title: 'X',
            description: 'Y'.repeat(20),
            location: { country: 'AR', province: 'CBA', city: 'Córdoba' },
            capacity: 2,
            pricing: { weekend: 120 },
            owner: 'u1'
        }
        const bad2 = {
            title: 'X',
            description: 'Y'.repeat(20),
            location: { country: 'AR', province: 'CBA', city: 'Córdoba' },
            capacity: 2,
            pricing: { weekday: 100 },
            owner: 'u1'
        }
        expect(() => lodgingSchema.parse(bad1)).toThrow()
        expect(() => lodgingSchema.parse(bad2)).toThrow()
    })
})

describe('asPublicLodging', () => {
    it('debería devolver null si lodging es falsy', () => {
        expect(asPublicLodging(null)).toBeNull()
        expect(asPublicLodging(undefined)).toBeNull()
    })

    it('debería normalizar id y ownerId a string y respetar pricing', () => {
        const lodging = {
            _id: { toString: () => 'l1' },
            title: 'Casa',
            description: 'Desc',
            images: ['https://example.com/x.jpg'],
            location: { country: 'AR', province: 'BA', city: 'La Plata' },
            capacity: 4,
            pricing: { weekday: 100, weekend: 150, holiday: 200 },
            owner: { _id: { toString: () => 'u1' } },
            isActive: false
        }
        const dto = asPublicLodging(lodging)
        expect(dto.id).toBe('l1')
        expect(dto.ownerId).toBe('u1')
        expect(dto.pricing).toEqual({ weekday: 100, weekend: 150, holiday: 200 })
        expect(dto.isActive).toBe(false)
    })

    it('debería tolerar owner/id como string y defaults seguros en pricing', () => {
        const lodging = {
            _id: 'l2',
            title: 'Cabaña',
            description: 'Bosque',
            images: [],
            location: { country: 'AR', province: 'NQN', city: 'SMAndes' },
            capacity: 2,
            pricing: { weekday: NaN, weekend: 0 },
            owner: 'u2'
        }
        const dto = asPublicLodging(lodging)
        expect(dto.id).toBe('l2')
        expect(dto.ownerId).toBe('u2')
        expect(dto.pricing.weekday).toBe(0)
        expect(dto.pricing.weekend).toBe(0)
        expect(dto.pricing.holiday).toBeUndefined()
    })
})
