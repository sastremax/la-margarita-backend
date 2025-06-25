import userService from '../services/user.service.js'

export async function getAllUsers(req, res, next) {
    try {
        const users = await userService.getAllUsers()
        res.status(200).json({ status: 'success', data: users })
    } catch (error) {
        next(error)
    }
}

export async function getUserById(req, res, next) {
    try {
        const user = await userService.getUserById(req.params.id)
        res.status(200).json({ status: 'success', data: user })
    } catch (error) {
        next(error)
    }
}

export async function updateUser(req, res, next) {
    try {
        const updatedUser = await userService.updateUser(req.params.id, req.body)
        res.status(200).json({ status: 'success', data: updatedUser })
    } catch (error) {
        next(error)
    }
}

export async function deleteUser(req, res, next) {
    try {
        await userService.deleteUser(req.params.id)
        res.status(204).end()
    } catch (error) {
        next(error)
    }
}
