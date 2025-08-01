import { describe, test, expect, beforeEach, vi } from 'vitest'

let authPolicy
const passportAuthenticateMock = vi.fn(() => (req, res, next) => next())

vi.mock('passport', () => ({
    default: {
        authenticate: () => passportAuthenticateMock()
    }
}))

beforeEach(async () => {
    vi.clearAllMocks()
    const module = await import('../../../src/middlewares/authPolicy.middleware.js')
    authPolicy = module.authPolicy
})

describe('authPolicy', () => {
    const res = {}
    const next = vi.fn()

    test('debería devolver error 401 si req.user no existe', () => {
        const req = {}
        const middleware = authPolicy(['admin'])[1]

        middleware(req, res, next)

        const err = next.mock.calls[0][0]
        expect(err.statusCode).toBe(401)
        expect(err.message).toBe('Not authenticated')
    })

    test('debería devolver error 403 si rol no permitido', () => {
        const req = { user: { role: 'user' } }
        const middleware = authPolicy(['admin'])[1]

        middleware(req, res, next)

        const err = next.mock.calls[0][0]
        expect(err.statusCode).toBe(403)
        expect(err.message).toBe('Access denied')
    })

    test('debería llamar a next() si el usuario tiene rol permitido', () => {
        const req = { user: { role: 'admin' } }
        const middleware = authPolicy(['admin'])[1]

        middleware(req, res, next)

        expect(next).toHaveBeenCalledWith()
    })
})
