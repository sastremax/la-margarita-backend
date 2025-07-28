import UserModel from '../models/user.model.js'

export class UserDAO {
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

    async updateUserRole(id, role) {
        return await UserModel.findByIdAndUpdate(id, { role }, { new: true })
    }
}
