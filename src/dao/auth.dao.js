import UserModel from '../models/user.model.js'

export class AuthDAO {
    async findUserByEmail(email) {
        const user = await UserModel.findOne({ email }).select('+password')
        console.log('DAO user found:', user)
        return user
    }

    async createUser(userData) {
        const createdUser = await UserModel.create(userData)
        return await UserModel.findOne({ _id: createdUser._id }).select('+password')
    }
}