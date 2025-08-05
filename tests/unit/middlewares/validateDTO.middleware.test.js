import { describe, expect, test, vi } from 'vitest'
import { z } from 'zod'
import { validateDTO } from '../../../src/middlewares/validateDTO.middleware.js'

describe('validateDTO middleware', () => {
    const sampleSchema = z.object({
        name: z.string().min(1),
        age: z.number().int().min(0)
    })

    test('should call next and mutate req.body if validation passes', () => {
        const req = {
            body: { name: 'Alice', age: 30 }
        }
        const res = {}
        const next = vi.fn()

        const middleware = validateDTO(sampleSchema)
        middleware(req, res, next)

        expect(req.body).toEqual({ name: 'Alice', age: 30 })
        expect(next).toHaveBeenCalledWith()
    })

    test('should return 400 with error details if validation fails', () => {
        const req = {
            body: { name: '', age: -1 }
        }

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        }

        const next = vi.fn()

        const middleware = validateDTO(sampleSchema)
        middleware(req, res, next)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({
            status: 'error',
            errors: expect.arrayContaining([
                expect.objectContaining({ path: 'name', message: expect.any(String) }),
                expect.objectContaining({ path: 'age', message: expect.any(String) })
            ])
        })

        expect(next).not.toHaveBeenCalled()
    })

    test('should throw error if schema is invalid', () => {
        const invalidSchema = {}

        expect(() => validateDTO(invalidSchema)).toThrow('Invalid schema provided to validateDTO middleware')
    })
})
