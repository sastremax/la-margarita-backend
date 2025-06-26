import UserModel from '../models/user.model.js'

class AuthDAO {
    async findUserByEmail(email) {
        return await UserModel.findOne({ email })
    }

    async createUser(userData) {
        return await UserModel.create(userData)
    }
}

export default AuthDAO