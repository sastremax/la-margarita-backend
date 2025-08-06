import mongoose from 'mongoose'
import UserModel from '../models/user.model.js'

export class UserDAO {
    async getAllUsers() {
        return await UserModel.find()
    }

    async getUserById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid user ID')
        }
        return await UserModel.findById(id)
    }

    async getUserByEmail(email) {
        return await UserModel.findOne({ email })
    }

    async createUser(userData) {
        return await UserModel.create(userData)
    }

    async updateUser(id, updateData) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid user ID')
        }
        return await UserModel.findByIdAndUpdate(id, updateData, { new: true })
    }

    async deleteUser(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid user ID')
        }
        return await UserModel.findByIdAndDelete(id)
    }

    async updateUserRole(id, role) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid user ID')
        }
        return await UserModel.findByIdAndUpdate(id, { role }, { new: true })
    }
}
