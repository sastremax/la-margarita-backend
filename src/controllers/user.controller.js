import userService from '../services/user.service.js'
import userDTO from '../dto/user.dto.js'

const getAllUsers = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers()
        const publicUsers = users.map(userDTO.asPublicUser)
        res.status(200).json({ status: 'success', data: publicUsers })
    } catch (error) {
        next(error)
    }
}

const getUserById = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.id)
        res.status(200).json({ status: 'success', data: userDTO.asPublicUser(user) })
    } catch (error) {
        next(error)
    }
}

const updateUser = async (req, res, next) => {
    try {
        const updatedUser = await userService.updateUser(req.params.id, req.body)
        res.status(200).json({ status: 'success', data: userDTO.asPublicUser(updatedUser) })
    } catch (error) {
        next(error)
    }
}

const deleteUser = async (req, res, next) => {
    try {
        await userService.deleteUser(req.params.id)
        res.status(204).end()
    } catch (error) {
        next(error)
    }
}

const updateUserRole = async (req, res, next) => {
    try {
        const { uid } = req.params
        const { role } = req.body

        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ status: 'error', message: 'Invalid role' })
        }

        const updatedUser = await userService.updateUserRole(uid, role)
        res.status(200).json({ status: 'success', data: userDTO.asPublicUser(updatedUser) })
    } catch (error) {
        next(error)
    }
}

export default {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    updateUserRole
}