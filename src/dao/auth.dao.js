import mongoose from 'mongoose'
import UserModel from '../models/user.model.js'

export class AuthDAO {
    async findUserByEmail(email) {
        return await UserModel.findOne({ email }).select('+password')
    }

    async createUser(userData) {
        const createdUser = await UserModel.create(userData)
        return await UserModel.findById(createdUser._id).select('+password')
    }

    async getUserById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid user ID')
        }
        return await UserModel.findById(id)
    }

    async updateUser(id, updateData) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid user ID')
        }
        return await UserModel.findByIdAndUpdate(id, updateData, { new: true })
    }
}
