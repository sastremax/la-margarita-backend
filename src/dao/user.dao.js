import UserModel from '../models/user.model.js'

class UserDAO {
    async getAllUsers() {
        return await UserModel.find()
    }

    async getUserById(id) {
        return await UserModel.findById(id)
    }

    async getUserByEmail(email) {
        return await UserModel.findOne({ email })
    }

    async createUser(userData) {
        return await UserModel.create(userData)
    }

    async updateUser(id, updateData) {
        return await UserModel.findByIdAndUpdate(id, updateData, { new: true })
    }

    async deleteUser(id) {
        return await UserModel.findByIdAndDelete(id)
    }
}

export default UserDAO
