import bcrypt from 'bcrypt'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { passwordUtil } from '../../../src/utils/password.util.js'

vi.mock('bcrypt')

describe('passwordUtil', () => {
    const plain = '123456'
    const hashed = '$2b$10$abc1234567890xyz'

    beforeEach(() => {
        vi.clearAllMocks()
    })

    test('encryptPassword should call bcrypt.hash with salt rounds', async () => {
        bcrypt.hash.mockResolvedValue(hashed)

        const result = await passwordUtil.encryptPassword(plain)

        expect(bcrypt.hash).toHaveBeenCalledWith(plain, 10)
        expect(result).toBe(hashed)
    })

    test('comparePassword should call bcrypt.compare correctly', async () => {
        bcrypt.compare.mockResolvedValue(true)

        const result = await passwordUtil.comparePassword(plain, hashed)

        expect(bcrypt.compare).toHaveBeenCalledWith(plain, hashed)
        expect(result).toBe(true)
    })

    test('comparePassword should return false if passwords do not match', async () => {
        bcrypt.compare.mockResolvedValue(false)

        const result = await passwordUtil.comparePassword(plain, hashed)

        expect(result).toBe(false)
    })
})
