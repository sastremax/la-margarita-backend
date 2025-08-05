import { describe, expect, test, vi } from 'vitest'
import { verifyOwnership } from '../../../src/middlewares/verifyOwnership.js'

describe('verifyOwnership middleware', () => {
    const res = {}
    let next

    beforeEach(() => {
        next = vi.fn()
    })

    test('should call next when requester is the owner', async () => {
        const req = { user: { id: '123' } }
        const getOwnerId = vi.fn().mockResolvedValue({ toString: () => '123' })

        const middleware = verifyOwnership(getOwnerId)
        await middleware(req, res, next)

        expect(next).toHaveBeenCalledWith()
    })

    test('should call next with 403 error when requester is not the owner', async () => {
        const req = { user: { id: '456' } }
        const getOwnerId = vi.fn().mockResolvedValue({ toString: () => '123' })

        const middleware = verifyOwnership(getOwnerId)
        await middleware(req, res, next)

        const err = next.mock.calls[0][0]
        expect(err?.statusCode).toBe(403)
        expect(err?.message).toBe('Access denied: You do not own this resource')
    })

    test('should call next with 403 error when requester id is missing', async () => {
        const req = { user: {} }
        const getOwnerId = vi.fn().mockResolvedValue({ toString: () => '123' })

        const middleware = verifyOwnership(getOwnerId)
        await middleware(req, res, next)

        const err = next.mock.calls[0][0]
        expect(err?.statusCode).toBe(403)
        expect(err?.message).toBe('Access denied: You do not own this resource')
    })

    test('should call next with error if getResourceOwnerId throws', async () => {
        const req = { user: { id: '123' } }
        const expectedError = new Error('DB fail')
        const getOwnerId = vi.fn().mockRejectedValue(expectedError)

        const middleware = verifyOwnership(getOwnerId)
        await middleware(req, res, next)

        expect(next).toHaveBeenCalledWith(expectedError)
    })
})
