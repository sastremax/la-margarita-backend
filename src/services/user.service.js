import { UserDAO } from '../dao/user.dao.js'
import { asUserPublic } from '../dto/user.dto.js'

const userDAO = new UserDAO()

class UserService {
    async getAllUsers() {
        const users = await userDAO.getAllUsers()
        return users.map(asUserPublic)
    }

    async getUserById(id) {
        const user = await userDAO.getUserById(id)
        return asUserPublic(user)
    }

    async getUserByEmail(email) {
        const user = await userDAO.getUserByEmail(email)
        return asUserPublic(user)
    }

    async createUser(userData) {
        const user = await userDAO.createUser(userData)
        return asUserPublic(user)
    }

    async updateUser(id, updateData) {
        const user = await userDAO.updateUser(id, updateData)
        return asUserPublic(user)
    }

    async deleteUser(id) {
        return await userDAO.deleteUser(id)
    }

    async updateUserRole(id, role) {
        const user = await userDAO.updateUserRole(id, role)
        return asUserPublic(user)
    }
}

export const userService = new UserService()
