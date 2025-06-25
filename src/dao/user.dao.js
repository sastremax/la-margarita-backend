import UserModel from '../models/user.model.js'

class UserDAO {
    static async getAllUsers() {
        return await UserModel.find()
    }

    static async getUserById(id) {
        return await UserModel.findById(id)
    }

    static async getUserByEmail(email) {
        return await UserModel.findOne({ email })
    }

    static async createUser(userData) {
        return await UserModel.create(userData)
    }

    static async updateUser(id, updateData) {
        return await UserModel.findByIdAndUpdate(id, updateData, { new: true })
    }

    static async deleteUser(id) {
        return await UserModel.findByIdAndDelete(id)
    }
}

export default UserDAO
