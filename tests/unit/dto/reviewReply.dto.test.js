import { describe, expect, it } from 'vitest'
import { reviewReplySchema } from '../../../src/dto/reviewReply.dto.js'

describe('reviewReplySchema', () => {
    it('debería aceptar un message válido', () => {
        const parsed = reviewReplySchema.parse({ message: 'Gracias por tu reseña' })
        expect(parsed.message).toBe('Gracias por tu reseña')
    })

    it('debería rechazar message vacío', () => {
        expect(() => reviewReplySchema.parse({ message: '' })).toThrow()
    })

    it('debería rechazar payload sin message', () => {
        expect(() => reviewReplySchema.parse({})).toThrow()
    })
})