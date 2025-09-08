import mongoose from 'mongoose'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { connectToDB } from '../../../src/config/db.js'
import { AuthDAO } from '../../../src/dao/auth.dao.js'
import UserModel from '../../../src/models/user.model.js'

describe('AuthDAO', () => {
    const dao = new AuthDAO()
    const unique = Date.now()
    const email = `authdao_${unique}@example.com`
    const plainPassword = 'Admin$12345'
    let createdUser

    beforeAll(async () => {
        await connectToDB()
        createdUser = await dao.createUser({
            firstName: 'Auth',
            lastName: 'DAO',
            email,
            password: plainPassword,
            role: 'user'
        })
    })

    afterAll(async () => {
        await UserModel.deleteOne({ email })
        await mongoose.disconnect()
    })

    it('debería crear un usuario y devolverlo con +password', async () => {
        expect(createdUser).toBeTruthy()
        expect(createdUser.email).toBe(email)
        expect(typeof createdUser.password).toBe('string')
        expect(createdUser.password).not.toBe(plainPassword)
    })

    it('debería encontrar un usuario por email incluyendo +password', async () => {
        const user = await dao.findUserByEmail(email)
        expect(user).toBeTruthy()
        expect(user.email).toBe(email)
        expect(typeof user.password).toBe('string')
    })

    it('debería obtener un usuario por id', async () => {
        const user = await dao.getUserById(createdUser._id.toString())
        expect(user).toBeTruthy()
        expect(user.email).toBe(email)
    })

    it('debería actualizar un usuario y devolver el documento actualizado', async () => {
        const token = `rt_${unique}`
        const updated = await dao.updateUser(createdUser._id.toString(), { resetToken: token })
        expect(updated).toBeTruthy()
        expect(updated.resetToken).toBe(token)
    })

    it('debería lanzar error con id inválido al obtener', async () => {
        await expect(dao.getUserById('invalid-id')).rejects.toThrow('Invalid user ID')
    })

    it('debería lanzar error con id inválido al actualizar', async () => {
        await expect(dao.updateUser('invalid-id', { role: 'admin' })).rejects.toThrow('Invalid user ID')
    })
})
