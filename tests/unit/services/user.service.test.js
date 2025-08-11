import { beforeEach, describe, expect, test, vi } from 'vitest'
import { asUserPublic } from '../../../src/dto/user.dto.js'

vi.mock('../../../src/dao/user.dao.js', () => {
    const getAllUsers = vi.fn()
    const getUserById = vi.fn()
    const getUserByEmail = vi.fn()
    const createUser = vi.fn()
    const updateUser = vi.fn()
    const deleteUser = vi.fn()
    const updateUserRole = vi.fn()

    return {
        UserDAO: vi.fn().mockImplementation(() => ({
            getAllUsers,
            getUserById,
            getUserByEmail,
            createUser,
            updateUser,
            deleteUser,
            updateUserRole
        })),
        __mocks: {
            getAllUsers,
            getUserById,
            getUserByEmail,
            createUser,
            updateUser,
            deleteUser,
            updateUserRole
        }
    }
})

vi.mock('../../../src/dto/user.dto.js', () => ({
    asUserPublic: vi.fn((user) => ({
        id: user._id,
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        cartId: user.cart?._id || null
    }))
}))

import { userService } from '../../../src/services/user.service.js'
import { __mocks } from '../../../src/dao/user.dao.js'

describe('userService', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    test('getAllUsers', async () => {
        __mocks.getAllUsers.mockResolvedValue([{ _id: '1', firstName: 'A', lastName: 'B', email: 'a@b.com', role: 'user' }])

        const result = await userService.getAllUsers()

        expect(__mocks.getAllUsers).toHaveBeenCalled()
        expect(result[0]).toMatchObject({ id: '1', email: 'a@b.com' })
    })

    test('getUserById', async () => {
        __mocks.getUserById.mockResolvedValue({ _id: '123', firstName: 'John', lastName: 'Doe', email: 'john@doe.com', role: 'user' })

        const result = await userService.getUserById('123')

        expect(__mocks.getUserById).toHaveBeenCalledWith('123')
        expect(result).toMatchObject({ id: '123', email: 'john@doe.com' })
    })

    test('getUserByEmail', async () => {
        __mocks.getUserByEmail.mockResolvedValue({ _id: 'x1', firstName: 'Ana', lastName: 'Perez', email: 'ana@p.com', role: 'user' })

        const result = await userService.getUserByEmail('ana@p.com')

        expect(__mocks.getUserByEmail).toHaveBeenCalledWith('ana@p.com')
        expect(result).toMatchObject({ id: 'x1', email: 'ana@p.com' })
    })

    test('createUser', async () => {
        const input = { firstName: 'A', lastName: 'B', email: 'a@b.com', password: '123456' }
        __mocks.createUser.mockResolvedValue({ _id: 'n1', ...input, role: 'user' })

        const result = await userService.createUser(input)

        expect(__mocks.createUser).toHaveBeenCalledWith(input)
        expect(result).toMatchObject({ id: 'n1', email: 'a@b.com' })
    })

    test('updateUser', async () => {
        const updated = { _id: 'id1', firstName: 'Updated', lastName: 'User', email: 'upd@e.com', role: 'user' }
        __mocks.updateUser.mockResolvedValue(updated)

        const result = await userService.updateUser('id1', { firstName: 'Updated' })

        expect(__mocks.updateUser).toHaveBeenCalledWith('id1', { firstName: 'Updated' })
        expect(result).toMatchObject({ id: 'id1', email: 'upd@e.com' })
    })

    test('deleteUser', async () => {
        __mocks.deleteUser.mockResolvedValue(true)

        const result = await userService.deleteUser('delete-id')

        expect(__mocks.deleteUser).toHaveBeenCalledWith('delete-id')
        expect(result).toBe(true)
    })

    test('updateUserRole', async () => {
        const updated = { _id: 'u1', firstName: 'A', lastName: 'B', email: 'ab@c.com', role: 'admin' }
        __mocks.updateUserRole.mockResolvedValue(updated)

        const result = await userService.updateUserRole('u1', 'admin')

        expect(__mocks.updateUserRole).toHaveBeenCalledWith('u1', 'admin')
        expect(result).toMatchObject({ id: 'u1', role: 'admin' })
    })
})
