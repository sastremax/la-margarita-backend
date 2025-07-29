import { describe, test, expect, vi, beforeEach } from 'vitest'
import { loginUser, registerUser, logoutUser, getUserByEmail, updateResetToken, updatePassword } from '../../../src/services/auth.service.js'
import { factory } from '../../../src/dao/factory.js'
import passwordUtil from '../../../src/utils/password.util.js'
import jwtUtil from '../../../src/utils/jwt.util.js'
import ApiError from '../../../src/utils/apiError.js'

vi.mock('../../../src/dao/factory.js')
vi.mock('../../../src/utils/password.util.js')
vi.mock('../../../src/utils/jwt.util.js')

describe('Auth Service', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    test('loginUser - success', async () => {
        const mockUser = { _id: 'abc', email: 'test@example.com', password: 'hashedpass' }
        factory.userDAO.getByEmail.mockResolvedValue(mockUser)
        passwordUtil.comparePassword.mockResolvedValue(true)
        jwtUtil.generateToken.mockReturnValue('mock-token')

        const result = await loginUser({ email: 'test@example.com', password: '123456' })

        expect(result).toEqual({ token: 'mock-token', userId: 'abc' })
    })

    test('loginUser - wrong credentials', async () => {
        factory.userDAO.getByEmail.mockResolvedValue(null)

        await expect(() => loginUser({ email: 'invalid@example.com', password: '123456' }))
            .rejects
            .toThrow(ApiError)
    })

    test('registerUser - success', async () => {
        const mockUser = { _id: 'u123', email: 'new@example.com' }
        factory.userDAO.getByEmail.mockResolvedValue(null)
        factory.userDAO.create.mockResolvedValue(mockUser)

        const result = await registerUser({ email: 'new@example.com', password: '12345678' })

        expect(result).toEqual(mockUser)
        expect(factory.userDAO.create).toHaveBeenCalled()
    })

    test('registerUser - already exists', async () => {
        factory.userDAO.getByEmail.mockResolvedValue({ email: 'existing@example.com' })

        await expect(() => registerUser({ email: 'existing@example.com', password: '12345678' }))
            .rejects
            .toThrow(ApiError)
    })

    test('logoutUser - success', async () => {
        const mockUser = { _id: 'u1', resetToken: 'old-token' }
        factory.userDAO.getById.mockResolvedValue(mockUser)
        factory.userDAO.update.mockResolvedValue({ ...mockUser, resetToken: null })

        const result = await logoutUser('u1')

        expect(result.resetToken).toBeNull()
    })

    test('getUserByEmail - found', async () => {
        const mockUser = { _id: 'u1', email: 'test@example.com' }
        factory.userDAO.getByEmail.mockResolvedValue(mockUser)

        const result = await getUserByEmail('test@example.com')

        expect(result).toEqual(mockUser)
    })

    test('getUserByEmail - not found', async () => {
        factory.userDAO.getByEmail.mockResolvedValue(null)

        await expect(() => getUserByEmail('notfound@example.com'))
            .rejects
            .toThrow(ApiError)
    })

    test('updateResetToken - success', async () => {
        const mockUser = { _id: 'u1', email: 'a@example.com' }
        factory.userDAO.update.mockResolvedValue({ ...mockUser, resetToken: 'token123' })

        const result = await updateResetToken('u1', 'token123')

        expect(result.resetToken).toBe('token123')
    })

    test('updatePassword - success', async () => {
        const encrypted = 'encryptedPassword'
        passwordUtil.encryptPassword.mockResolvedValue(encrypted)
        factory.userDAO.update.mockResolvedValue({ _id: 'u1', password: encrypted })

        const result = await updatePassword('u1', 'newpassword')

        expect(result.password).toBe(encrypted)
    })
})
