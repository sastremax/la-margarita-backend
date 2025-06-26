import AuthDAO from '../dao/auth.dao.js'
import bcrypt from 'bcrypt'
import tokenService from './token.service.js'
import asUserPublic from '../dto/user.dto.js'

const authDAO = new AuthDAO()

const registerUser = async ({ firstName, lastName, email, password }) => {
    const existingUser = await authDAO.findUserByEmail(email)
    if (existingUser) throw new Error('Email already registered')

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await authDAO.createUser({
        firstName,
        lastName,
        email,
        password: hashedPassword
    })

    return asUserPublic(newUser)
}

const loginUser = async ({ email, password }) => {
    const user = await authDAO.findUserByEmail(email)
    if (!user) throw new Error('Invalid credentials')

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) throw new Error('Invalid credentials')

    const token = tokenService.generateAccessToken({ userId: user._id, role: user.role })

    return { token, user: asUserPublic(user) }
}

export default {
    registerUser,
    loginUser
}