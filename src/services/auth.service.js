import { AuthDAO } from '../dao/auth.dao.js'
import { passwordUtil } from '../utils/password.util.js'
import { ApiError } from '../utils/apiError.js'

const authDAO = new AuthDAO()

export const registerUser = async ({ firstName, lastName, email, password }) => {
    const existingUser = await authDAO.findUserByEmail(email)
    if (existingUser) throw new ApiError(400, 'Email already registered')

    const newUser = await authDAO.createUser({
        firstName,
        lastName,
        email,
        password
    })

    return newUser
}

export const loginUser = async (email, password) => {
    const user = await authDAO.findUserByEmail(email)
    if (!user) throw new ApiError(401, 'Invalid credentials')

    const validPassword = await passwordUtil.comparePassword(password, user.password)
    if (!validPassword) throw new ApiError(401, 'Invalid credentials')

    return user
}

export const logoutUser = async (userId) => {
    const user = await authDAO.getUserById(userId)
    if (!user) throw new ApiError(404, 'User not found')

    const updatedUser = await authDAO.updateUser(userId, { resetToken: null })
    return updatedUser
}

export const getUserByEmail = async (email) => {
    const user = await authDAO.findUserByEmail(email)
    if (!user) throw new ApiError(404, 'User not found')

    return user
}

export const updateResetToken = async (userId, resetToken) => {
    const updatedUser = await authDAO.updateUser(userId, { resetToken })
    return updatedUser
}

export const updatePassword = async (userId, newPassword) => {
    const encryptedPassword = await passwordUtil.encryptPassword(newPassword)
    const updatedUser = await authDAO.updateUser(userId, { password: encryptedPassword })
    return updatedUser
}
