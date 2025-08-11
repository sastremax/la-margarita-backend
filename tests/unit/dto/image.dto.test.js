import { describe, expect, it } from 'vitest'
import { asPublicImage, imageSchema } from '../../../src/dto/image.dto.js'

describe('imageSchema', () => {
    it('debería validar un payload correcto', () => {
        const data = {
            url: 'https://example.com/img.jpg',
            name: 'front',
            type: 'lodging',
            refId: '64f1a9b8c0a1a1a1a1a1a1a1',
            publicId: 'cloudinary_123'
        }
        const parsed = imageSchema.parse(data)
        expect(parsed).toEqual(data)
    })

    it('debería rechazar url inválida y type fuera de enum', () => {
        expect(() =>
            imageSchema.parse({
                url: 'notaurl',
                name: 'x',
                type: 'avatar',
                refId: '1'
            })
        ).toThrow()
    })

    it('debería requerir name y refId', () => {
        expect(() =>
            imageSchema.parse({
                url: 'https://ok.com/a.png',
                type: 'profile'
            })
        ).toThrow()
    })
})

describe('asPublicImage', () => {
    it('debería devolver null si image es falsy', () => {
        expect(asPublicImage(null)).toBeNull()
        expect(asPublicImage(undefined)).toBeNull()
    })

    it('debería normalizar id, mapear associatedType/associatedId y serializar fechas', () => {
        const img = {
            _id: { toString: () => 'i1' },
            url: 'https://example.com/a.jpg',
            name: 'front',
            associatedType: 'lodging',
            associatedId: { toString: () => 'l1' },
            public_id: 'pub1',
            createdAt: new Date('2025-08-10T00:00:00.000Z'),
            updatedAt: new Date('2025-08-11T00:00:00.000Z')
        }
        const dto = asPublicImage(img)
        expect(dto).toEqual({
            id: 'i1',
            url: 'https://example.com/a.jpg',
            name: 'front',
            type: 'lodging',
            refId: 'l1',
            publicId: 'pub1',
            createdAt: '2025-08-10T00:00:00.000Z',
            updatedAt: '2025-08-11T00:00:00.000Z'
        })
    })

    it('debería aceptar aliases type/publicId ya normalizados y ids como string', () => {
        const img = {
            _id: 'i2',
            url: 'https://example.com/b.jpg',
            name: 'back',
            type: 'product',
            associatedId: 'p1',
            publicId: 'pub2',
            createdAt: '2025-08-09T00:00:00.000Z',
            updatedAt: '2025-08-09T10:00:00.000Z'
        }
        const dto = asPublicImage(img)
        expect(dto.id).toBe('i2')
        expect(dto.type).toBe('product')
        expect(dto.refId).toBe('p1')
        expect(dto.publicId).toBe('pub2')
        expect(dto.createdAt).toBe('2025-08-09T00:00:00.000Z')
        expect(dto.updatedAt).toBe('2025-08-09T10:00:00.000Z')
    })
})
