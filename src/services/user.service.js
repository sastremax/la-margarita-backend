import UserDAO from '../dao/user.dao.js'
import asUserPublic from '../dto/user.dto.js'

const userDAO = new UserDAO()

class UserService {
    static async getAllUsers() {
        const users = await userDAO.getAllUsers()
        return users.map(asUserPublic)
    }

    static async getUserById(id) {
        const user = await userDAO.getUserById(id)
        return asUserPublic(user)
    }

    static async getUserByEmail(email) {
        const user = await userDAO.getUserByEmail(email)
        return asUserPublic(user)
    }

    static async createUser(userData) {
        const user = await userDAO.createUser(userData)
        return asUserPublic(user)
    }

    static async updateUser(id, updateData) {
        const user = await userDAO.updateUser(id, updateData)
        return asUserPublic(user)
    }

    static async deleteUser(id) {
        return await userDAO.deleteUser(id)
    }

    static async updateUserRole(id, role) {
        const user = await userDAO.updateUserRole(id, role)
        return asUserPublic(user)
    }
}

export default UserService