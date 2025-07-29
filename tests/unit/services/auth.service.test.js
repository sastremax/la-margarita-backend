import { describe, test, expect, vi, beforeEach } from 'vitest'

vi.mock('../../../src/dao/auth.dao.js', () => {
    const findUserByEmail = vi.fn()
    const createUser = vi.fn()
    const getUserById = vi.fn()
    const updateUser = vi.fn()

    return {
        AuthDAO: vi.fn().mockImplementation(() => ({
            findUserByEmail,
            createUser,
            getUserById,
            updateUser
        })),
        __mocks: {
            findUserByEmail,
            createUser,
            getUserById,
            updateUser
        }
    }
})

vi.mock('../../../src/services/token.service.js', () => ({
    tokenService: {
        generateAccessToken: vi.fn()
    }
}))

vi.mock('../../../src/utils/password.util.js', () => ({
    passwordUtil: {
        encryptPassword: vi.fn(),
        comparePassword: vi.fn()
    }
}))

vi.mock('../../../src/dto/user.dto.js', () => ({
    asUserPublic: (user) => ({
        id: user._id,
        email: user.email,
        role: user.role
    })
}))

import {
    loginUser,
    registerUser,
    logoutUser,
    getUserByEmail,
    updateResetToken,
    updatePassword
} from '../../../src/services/auth.service.js'

import { tokenService } from '../../../src/services/token.service.js'
import { passwordUtil } from '../../../src/utils/password.util.js'
import { ApiError } from '../../../src/utils/apiError.js'
import { __mocks } from '../../../src/dao/auth.dao.js'

describe('Auth Service', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    test('registerUser - success', async () => {
        __mocks.findUserByEmail.mockResolvedValue(null)
        __mocks.createUser.mockResolvedValue({ _id: '1', email: 'new@example.com', role: 'user' })

        const result = await registerUser({
            firstName: 'John',
            lastName: 'Doe',
            email: 'new@example.com',
            password: '123456'
        })

        expect(result).toEqual({
            id: '1',
            email: 'new@example.com',
            role: 'user'
        })
    })

    test('registerUser - email already exists', async () => {
        __mocks.findUserByEmail.mockResolvedValue({ _id: 'x1', email: 'exists@example.com' })

        await expect(() =>
            registerUser({
                firstName: 'A',
                lastName: 'B',
                email: 'exists@example.com',
                password: '12345678'
            })
        ).rejects.toThrow(ApiError)
    })

    test('loginUser - success', async () => {
        __mocks.findUserByEmail.mockResolvedValue({
            _id: 'u1',
            email: 'test@example.com',
            password: 'hashedpass',
            role: 'user'
        })
        passwordUtil.comparePassword.mockResolvedValue(true)
        tokenService.generateAccessToken.mockReturnValue('mock-token')        

        const result = await loginUser({ email: 'test@example.com', password: '123456' })

        expect(result).toEqual({
            token: 'mock-token',
            user: {
                id: 'u1',
                email: 'test@example.com',
                role: 'user'
            }
        })
    })

    test('loginUser - user not found', async () => {
        __mocks.findUserByEmail.mockResolvedValue(null)

        await expect(() =>
            loginUser({ email: 'invalid@example.com', password: '123456' })
        ).rejects.toThrow(ApiError)
    })

    test('loginUser - invalid password', async () => {
        __mocks.findUserByEmail.mockResolvedValue({ password: 'hashedpass' })
        passwordUtil.comparePassword.mockResolvedValue(false)

        await expect(() =>
            loginUser({ email: 'wrong@example.com', password: 'wrongpass' })
        ).rejects.toThrow(ApiError)
    })

    test('logoutUser - success', async () => {
        __mocks.getUserById.mockResolvedValue({ _id: 'u1', resetToken: 'abc' })
        __mocks.updateUser.mockResolvedValue({ _id: 'u1', resetToken: null })

        const result = await logoutUser('u1')
        expect(result.resetToken).toBeNull()
    })

    test('getUserByEmail - found', async () => {
        const user = { _id: 'u2', email: 'x@example.com', role: 'user' }
        __mocks.findUserByEmail.mockResolvedValue(user)

        const result = await getUserByEmail('x@example.com')
        expect(result).toEqual(user)
    })

    test('getUserByEmail - not found', async () => {
        __mocks.findUserByEmail.mockResolvedValue(null)

        await expect(() =>
            getUserByEmail('notfound@example.com')
        ).rejects.toThrow(ApiError)
    })

    test('updateResetToken - success', async () => {
        __mocks.updateUser.mockResolvedValue({ _id: 'u1', resetToken: 'abc123' })

        const result = await updateResetToken('u1', 'abc123')
        expect(result.resetToken).toBe('abc123')
    })

    test('updatePassword - success', async () => {
        passwordUtil.encryptPassword.mockResolvedValue('encryptedPass')
        __mocks.updateUser.mockResolvedValue({ _id: 'u1', password: 'encryptedPass' })

        const result = await updatePassword('u1', 'newpass')
        expect(result.password).toBe('encryptedPass')
    })
})
