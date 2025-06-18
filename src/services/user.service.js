import UserModel from '../models/user.model.js'

const getAllUsers = async () => {
    return await UserModel.find()
}

const getUserById = async (id) => {
    const user = await UserModel.findById(id)
    if (!user) throw new Error('User not found')
    return user
}

const updateUser = async (id, updates) => {
    const user = await UserModel.findByIdAndUpdate(id, updates, { new: true })
    if (!user) throw new Error('User not found or update failed')
    return user
}

const deleteUser = async (id) => {
    const deleted = await UserModel.findByIdAndDelete(id)
    if (!deleted) throw new Error('User not found or delete failed')
    return deleted
}

export default {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
}
