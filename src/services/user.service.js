import UserDAO from '../dao/user.dao.js'
import asUserPublic from '../dto/user.dto.js'

class UserService {
    static async getAllUsers() {
        const users = await UserDAO.getAllUsers()
        return users.map(asUserPublic)
    }

    static async getUserById(id) {
        const user = await UserDAO.getUserById(id)
        return asUserPublic(user)
    }

    static async getUserByEmail(email) {
        const user = await UserDAO.getUserByEmail(email)
        return asUserPublic(user)
    }

    static async createUser(userData) {
        const user = await UserDAO.createUser(userData)
        return asUserPublic(user)
    }

    static async updateUser(id, updateData) {
        const user = await UserDAO.updateUser(id, updateData)
        return asUserPublic(user)
    }

    static async deleteUser(id) {
        return await UserDAO.deleteUser(id)
    }

    static async updateUserRole(id, role) {
        const user = await UserDAO.updateUserRole(id, role)
        return asUserPublic(user)
    }
}

export default UserService