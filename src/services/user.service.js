import UserDAO from '../dao/user.dao.js'

class UserService {

    static async getAllUsers() {
        return await UserDAO.getAllUsers()
    }

    static async getUserById(id) {
        return await UserDAO.getUserById(id)
    }

    static async getUserByEmail(email) {
        return await UserDAO.getUserByEmail(email)
    }

    static async createUser(userData) {
        return await UserDAO.createUser(userData)
    }

    static async updateUser(id, updateData) {
        return await UserDAO.updateUser(id, updateData)
    }

    static async deleteUser(id) {
        return await UserDAO.deleteUser(id)
    }
}

export default UserService