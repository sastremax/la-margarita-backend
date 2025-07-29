import { describe, test, expect, vi, beforeEach } from 'vitest'
import * as authService from '../../../src/services/auth.service.js'
import { tokenService } from '../../../src/services/token.service.js'
import { ApiError } from '../../../src/utils/apiError.js'

vi.mock('../../../src/dao/auth.dao.js', () => {
    return {
        AuthDAO: vi.fn().mockImplementation(() => ({
            findUserByEmail: vi.fn(),
            createUser: vi.fn()
        }))
    }
})

vi.mock('../../../src/services/token.service.js', () => {
    return {
        tokenService: {
            generateAccessToken: vi.fn()
        }
    }
})

vi.mock('bcrypt', () => ({
    compare: vi.fn()
}))

vi.mock('../../../src/dto/user.dto.js', () => ({
    asPublicUser: (user) => ({
        id: user._id,
        email: user.email,
        role: user.role
    })
}))

import bcrypt from 'bcrypt'
import { AuthDAO } from '../../../src/dao/auth.dao.js'

describe('auth.service', () => {
    let daoInstance

    beforeEach(() => {
        vi.clearAllMocks()
        daoInstance = new AuthDAO()
    })

    test('registerUser - should create user when email is not registered', async () => {
        daoInstance.findUserByEmail.mockResolvedValue(null)
        daoInstance.createUser.mockResolvedValue({
            _id: 'u1',
            email: 'test@example.com',
            role: 'user'
        })

        const result = await authService.registerUser({
            firstName: 'John',
            lastName: 'Doe',
            email: 'test@example.com',
            password: '12345678'
        })

        expect(result).toEqual({
            id: 'u1',
            email: 'test@example.com',
            role: 'user'
        })
    })

    test('registerUser - should throw error if email already registered', async () => {
        daoInstance.findUserByEmail.mockResolvedValue({ email: 'exists@example.com' })

        await expect(() =>
            authService.registerUser({
                firstName: 'A',
                lastName: 'B',
                email: 'exists@example.com',
                password: '12345678'
            })
        ).rejects.toThrow(ApiError)
    })

    test('loginUser - should return token and user if credentials are valid', async () => {
        const mockUser = {
            _id: 'u2',
            email: 'login@example.com',
            password: 'hashed',
            role: 'user'
        }

        daoInstance.findUserByEmail.mockResolvedValue(mockUser)
        bcrypt.compare.mockResolvedValue(true)
        tokenService.generateAccessToken.mockReturnValue('mock-token')

        const result = await authService.loginUser({
            email: 'login@example.com',
            password: '123456'
        })

        expect(result).toEqual({
            token: 'mock-token',
            user: {
                id: 'u2',
                email: 'login@example.com',
                role: 'user'
            }
        })
    })

    test('loginUser - should throw error if user not found', async () => {
        daoInstance.findUserByEmail.mockResolvedValue(null)

        await expect(() =>
            authService.loginUser({
                email: 'nouser@example.com',
                password: '123456'
            })
        ).rejects.toThrow(ApiError)
    })

    test('loginUser - should throw error if password is invalid', async () => {
        daoInstance.findUserByEmail.mockResolvedValue({
            _id: 'u2',
            email: 'login@example.com',
            password: 'hashed'
        })

        bcrypt.compare.mockResolvedValue(false)

        await expect(() =>
            authService.loginUser({
                email: 'login@example.com',
                password: 'wrong'
            })
        ).rejects.toThrow(ApiError)
    })
})