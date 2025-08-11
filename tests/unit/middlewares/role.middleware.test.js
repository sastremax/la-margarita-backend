import { describe, expect, test, vi } from 'vitest'
import { authorizeRoles } from '../../../src/middlewares/role.middleware.js'

describe('authorizeRoles middleware', () => {
    const rolesAllowed = ['admin', 'manager']

    const createMock = (user) => {
        const req = { user }
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        }
        const next = vi.fn()
        return { req, res, next }
    }

    test('should return 403 if req.user is missing', () => {
        const { req, res, next } = createMock(undefined)
        const middleware = authorizeRoles(...rolesAllowed)

        middleware(req, res, next)

        expect(res.status).toHaveBeenCalledWith(403)
        expect(res.json).toHaveBeenCalledWith({
            status: 'error',
            message: 'Access denied'
        })
        expect(next).not.toHaveBeenCalled()
    })

    test('should return 403 if user role is not authorized', () => {
        const { req, res, next } = createMock({ role: 'user' })
        const middleware = authorizeRoles(...rolesAllowed)

        middleware(req, res, next)

        expect(res.status).toHaveBeenCalledWith(403)
        expect(res.json).toHaveBeenCalledWith({
            status: 'error',
            message: 'Access denied'
        })
        expect(next).not.toHaveBeenCalled()
    })

    test('should call next if user role is authorized', () => {
        const { req, res, next } = createMock({ role: 'admin' })
        const middleware = authorizeRoles(...rolesAllowed)

        middleware(req, res, next)

        expect(next).toHaveBeenCalled()
        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()
    })
})
