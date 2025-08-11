import { describe, expect, it } from 'vitest'
import { reviewDTO } from '../../../src/dto/review.dto.js'

const { reviewSchema, reviewQuerySchema, reviewUpdateSchema, asPublicReview } = reviewDTO

describe('reviewSchema', () => {
    it('debería validar y coerces rating y subratings', () => {
        const data = {
            user: 'u1',
            lodging: 'l1',
            reservation: 'r1',
            rating: '5',
            cleanliness: '4',
            location: '3',
            service: '2',
            valueForMoney: '5',
            comment: 'Muy bueno'
        }
        const parsed = reviewSchema.parse(data)
        expect(parsed.rating).toBe(5)
        expect(parsed.cleanliness).toBe(4)
        expect(parsed.location).toBe(3)
        expect(parsed.service).toBe(2)
        expect(parsed.valueForMoney).toBe(5)
    })

    it('debería rechazar rating fuera de rango', () => {
        const bad = {
            user: 'u1',
            lodging: 'l1',
            reservation: 'r1',
            rating: 6,
            comment: 'x'
        }
        expect(() => reviewSchema.parse(bad)).toThrow()
    })
})

describe('reviewQuerySchema', () => {
    it('debería transformar hasReply y minRating', () => {
        const parsed = reviewQuerySchema.parse({ lodgingId: 'l1', hasReply: 'true', minRating: '4' })
        expect(parsed.hasReply).toBe(true)
        expect(parsed.minRating).toBe(4)
        expect(parsed.lodgingId).toBe('l1')
    })

    it('debería permitir hasReply booleano directo', () => {
        const parsed = reviewQuerySchema.parse({ hasReply: false })
        expect(parsed.hasReply).toBe(false)
    })
})

describe('reviewUpdateSchema', () => {
    it('debería coerces rating y adminReply.createdAt', () => {
        const data = {
            rating: '4',
            adminReply: { message: 'Gracias', createdAt: '2025-08-10T00:00:00.000Z' }
        }
        const parsed = reviewUpdateSchema.parse(data)
        expect(parsed.rating).toBe(4)
        expect(parsed.adminReply?.createdAt instanceof Date).toBe(true)
    })
})

describe('asPublicReview', () => {
    it('debería devolver null si review es falsy', () => {
        expect(asPublicReview(null)).toBeNull()
        expect(asPublicReview(undefined)).toBeNull()
    })

    it('debería normalizar ids y serializar fechas ISO', () => {
        const review = {
            _id: { toString: () => 'rev1' },
            lodging: { _id: { toString: () => 'l1' } },
            reservation: { _id: { toString: () => 'r1' } },
            user: { _id: { toString: () => 'u1' }, firstName: 'Ana', country: 'AR' },
            rating: 5,
            cleanliness: 4,
            location: 3,
            service: 2,
            valueForMoney: 5,
            comment: 'Excelente',
            adminReply: { message: 'Gracias', createdAt: new Date('2025-08-11T00:00:00.000Z') },
            createdAt: new Date('2025-08-10T00:00:00.000Z'),
            updatedAt: new Date('2025-08-12T00:00:00.000Z')
        }
        const dto = asPublicReview(review)
        expect(dto).toEqual({
            id: 'rev1',
            lodgingId: 'l1',
            reservationId: 'r1',
            user: { id: 'u1', firstName: 'Ana', country: 'AR' },
            rating: 5,
            cleanliness: 4,
            location: 3,
            service: 2,
            valueForMoney: 5,
            comment: 'Excelente',
            adminReply: { message: 'Gracias', createdAt: '2025-08-11T00:00:00.000Z' },
            createdAt: '2025-08-10T00:00:00.000Z',
            updatedAt: '2025-08-12T00:00:00.000Z'
        })
    })

    it('debería aceptar ids como string y adminReply nulo', () => {
        const review = {
            _id: 'rev2',
            lodging: 'l2',
            reservation: 'r2',
            user: 'u2',
            rating: 4,
            comment: 'Ok'
        }
        const dto = asPublicReview(review)
        expect(dto.id).toBe('rev2')
        expect(dto.lodgingId).toBe('l2')
        expect(dto.reservationId).toBe('r2')
        expect(dto.user.id).toBe('u2')
        expect(dto.adminReply).toBeNull()
    })
})
