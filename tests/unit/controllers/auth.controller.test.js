import { beforeEach, describe, expect, test, vi } from 'vitest'

vi.mock('../../../src/services/auth.service.js', () => ({
    loginUser: vi.fn(),
    registerUser: vi.fn()
}))

vi.mock('../../../src/services/audit.service.js', () => ({
    AuditService: {
        logEvent: vi.fn()
    }
}))

vi.mock('../../../src/utils/jwt.util.js', () => ({
    jwtUtil: {
        createAccessToken: vi.fn(),
        createRefreshToken: vi.fn()
    }
}))

vi.mock('../../../src/dto/user.dto.js', () => ({
    asUserPublic: vi.fn()
}))

import { postLogin, postRegister, postLogout } from '../../../src/controllers/auth.controller.js'
import { loginUser, registerUser } from '../../../src/services/auth.service.js'
import { AuditService } from '../../../src/services/audit.service.js'
import { jwtUtil } from '../../../src/utils/jwt.util.js'
import { asUserPublic } from '../../../src/dto/user.dto.js'

describe('auth.controller', () => {
    let req, res, next

    beforeEach(() => {
        vi.clearAllMocks()

        req = {
            body: {},
            ip: '123.456.789.0',
            headers: { 'user-agent': 'Vitest' },
            user: { _id: 'u123' }
        }

        res = {
            cookie: vi.fn(),
            clearCookie: vi.fn(),
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        }

        next = vi.fn()
    })

    test('postLogin - success', async () => {
        const user = { _id: 'u1', role: 'user' }
        req.body = { email: 'test@example.com', password: '123456' }

        loginUser.mockResolvedValue(user)
        jwtUtil.createAccessToken.mockReturnValue('access-token')
        jwtUtil.createRefreshToken.mockReturnValue('refresh-token')
        asUserPublic.mockReturnValue({ id: 'u1', email: 'test@example.com' })
        AuditService.logEvent.mockResolvedValue()

        await postLogin(req, res, next)

        expect(loginUser).toHaveBeenCalledWith({ email: 'test@example.com', password: '123456' })
        expect(jwtUtil.createAccessToken).toHaveBeenCalledWith(user)
        expect(jwtUtil.createRefreshToken).toHaveBeenCalledWith(user)
        expect(res.cookie).toHaveBeenCalledTimes(2)
        expect(AuditService.logEvent).toHaveBeenCalledWith(expect.objectContaining({
            userId: 'u1',
            event: 'login',
            success: true
        }))
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: { user: { id: 'u1', email: 'test@example.com' } }
        })
    })

    test('postRegister - success', async () => {
        const user = { _id: 'u2', email: 'new@example.com' }
        req.body = { firstName: 'A', lastName: 'B', email: 'new@example.com', password: '123456' }

        registerUser.mockResolvedValue(user)
        asUserPublic.mockReturnValue({ id: 'u2', email: 'new@example.com' })
        AuditService.logEvent.mockResolvedValue()

        await postRegister(req, res, next)

        expect(registerUser).toHaveBeenCalledWith(req.body)
        expect(AuditService.logEvent).toHaveBeenCalledWith(expect.objectContaining({
            userId: 'u2',
            event: 'register',
            success: true
        }))
        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: { id: 'u2', email: 'new@example.com' }
        })
    })

    test('postLogout - success', async () => {
        await postLogout(req, res, next)

        expect(res.clearCookie).toHaveBeenCalledWith('token')
        expect(res.clearCookie).toHaveBeenCalledWith('refreshToken')
        expect(AuditService.logEvent).toHaveBeenCalledWith(expect.objectContaining({
            userId: 'u123',
            event: 'logout',
            success: true
        }))
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            message: 'User logged out successfully'
        })
    })
})
