import authService from '../services/auth.service.js'
import jwtUtil from '../utils/jwt.util.js'

export async function postLogin(req, res, next) {
    try {
        const { email, password } = req.body
        const user = await authService.loginUser(email, password)
        const token = jwtUtil.createToken(user)
        res.status(200).json({ status: 'success', data: { user, token } })
    } catch (error) {
        next(error)
    }
}

export async function postRegister(req, res, next) {
    try {
        const { firstName, lastName, email, password } = req.body

        const userData = {
            firstName,
            lastName,
            email,
            password,
            role: 'user'
        }

        const user = await authService.registerUser(userData)
        res.status(201).json({ status: 'success', data: user })
    } catch (error) {
        next(error)
    }
}

export async function postLogout(req, res, next) {
    try {

        res.status(200).json({ status: 'success', message: 'User logged out' })
    } catch (error) {
        next(error)
    }
}
