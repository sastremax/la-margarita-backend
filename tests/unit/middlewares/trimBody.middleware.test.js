import { describe, expect, test, vi } from 'vitest'

import { trimBody } from '../../../src/middlewares/trimBody.middleware.js'

describe('trimBody middleware', () => {
    test('should trim all string properties in req.body and call next', () => {
        const req = {
            body: {
                name: '  John  ',
                email: ' test@example.com ',
                age: 30,
                nested: { value: '  test  ' }
            }
        }
        const res = {}
        const next = vi.fn()

        trimBody(req, res, next)

        expect(req.body.name).toBe('John')
        expect(req.body.email).toBe('test@example.com')
        expect(req.body.age).toBe(30)
        expect(req.body.nested).toEqual({ value: '  test  ' }) // no se toca
        expect(next).toHaveBeenCalled()
    })

    test('should call next with error if exception is thrown', () => {
        const req = {
            get body() {
                throw new Error('broken')
            }
        }
        const res = {}
        const next = vi.fn()

        trimBody(req, res, next)

        expect(next).toHaveBeenCalled()
        expect(next.mock.calls[0][0]).toBeInstanceOf(Error)
        expect(next.mock.calls[0][0].message).toBe('broken')
    })
})
