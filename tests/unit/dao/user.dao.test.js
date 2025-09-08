import mongoose from 'mongoose'
import { beforeEach, describe, expect, test, vi } from 'vitest'

vi.mock('../../../src/models/user.model.js', async () => {
    return {
        default: {
            find: vi.fn(),
            findById: vi.fn(),
            findOne: vi.fn(),
            create: vi.fn(),
            findByIdAndUpdate: vi.fn(),
            findByIdAndDelete: vi.fn()
        }
    }
})

let UserModel
let UserDAO
let userDAO

beforeEach(async () => {
    vi.clearAllMocks()

    UserModel = (await import('../../../src/models/user.model.js')).default
        ; ({ UserDAO } = await import('../../../src/dao/user.dao.js'))
    userDAO = new UserDAO()
})

describe('UserDAO', () => {
    test('getAllUsers should call find()', async () => {
        await userDAO.getAllUsers()
        expect(UserModel.find).toHaveBeenCalled()
    })

    test('getUserById should validate ID and call findById', async () => {
        const id = new mongoose.Types.ObjectId().toString()
        await userDAO.getUserById(id)
        expect(UserModel.findById).toHaveBeenCalledWith(id)
    })

    test('getUserById should throw if ID is invalid', async () => {
        await expect(userDAO.getUserById('invalid-id')).rejects.toThrow('Invalid user ID')
        expect(UserModel.findById).not.toHaveBeenCalled()
    })

    test('getUserByEmail should call findOne with email', async () => {
        const email = 'test@example.com'
        await userDAO.getUserByEmail(email)
        expect(UserModel.findOne).toHaveBeenCalledWith({ email })
    })

    test('createUser should call create with user data', async () => {
        const data = { email: 'new@example.com', password: 'Admin$12345' }
        await userDAO.createUser(data)
        expect(UserModel.create).toHaveBeenCalledWith(data)
    })

    test('updateUser should validate ID and call findByIdAndUpdate', async () => {
        const id = new mongoose.Types.ObjectId().toString()
        const update = { firstName: 'New' }
        await userDAO.updateUser(id, update)
        expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(id, update, { new: true })
    })

    test('updateUser should throw if ID is invalid', async () => {
        await expect(userDAO.updateUser('invalid-id', {})).rejects.toThrow('Invalid user ID')
        expect(UserModel.findByIdAndUpdate).not.toHaveBeenCalled()
    })

    test('deleteUser should validate ID and call findByIdAndDelete', async () => {
        const id = new mongoose.Types.ObjectId().toString()
        await userDAO.deleteUser(id)
        expect(UserModel.findByIdAndDelete).toHaveBeenCalledWith(id)
    })

    test('deleteUser should throw if ID is invalid', async () => {
        await expect(userDAO.deleteUser('invalid-id')).rejects.toThrow('Invalid user ID')
        expect(UserModel.findByIdAndDelete).not.toHaveBeenCalled()
    })

    test('updateUserRole should validate ID and call findByIdAndUpdate with role', async () => {
        const id = new mongoose.Types.ObjectId().toString()
        const role = 'admin'
        await userDAO.updateUserRole(id, role)
        expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(id, { role }, { new: true })
    })

    test('updateUserRole should throw if ID is invalid', async () => {
        await expect(userDAO.updateUserRole('invalid-id', 'admin')).rejects.toThrow('Invalid user ID')
        expect(UserModel.findByIdAndUpdate).not.toHaveBeenCalled()
    })
})
