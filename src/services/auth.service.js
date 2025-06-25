import UserModel from '../models/user.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const registerUser = async ({ firstName, lastName, email, password }) => {
    const existingUser = await UserModel.findOne({ email })
    if (existingUser) throw new Error('Email already registered')

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await UserModel.create({
        firstName,
        lastName,
        email,
        password: hashedPassword
    })

    return newUser
}

const loginUser = async ({ email, password }) => {
    const user = await UserModel.findOne({ email })
    if (!user) throw new Error('Invalid credentials')

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) throw new Error('Invalid credentials')

    const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    )

    return { token, user }
}

export default {
    registerUser,
    loginUser
}
