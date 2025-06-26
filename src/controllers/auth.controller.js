import authService from '../services/auth.service.js'
import jwtUtil from '../utils/jwt.util.js'
import userDTO from '../dto/user.dto.js'

const postLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await authService.loginUser(email, password)

        const accessToken = jwtUtil.createAccessToken(user)
        const refreshToken = jwtUtil.createRefreshToken(user)

        res.cookie('token', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
        })

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({ status: 'success', data: { user: userDTO.asPublicUser(user) } })
    } catch (error) {
        next(error)
    }
}

const postRegister = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password } = req.body
        const user = await authService.registerUser({ firstName, lastName, email, password })
        res.status(201).json({ status: 'success', data: userDTO.asPublicUser(user) })
    } catch (error) {
        next(error)
    }
}

const postLogout = async (req, res, next) => {
    try {
        res.clearCookie('token')
        res.clearCookie('refreshToken')
        res.status(200).json({ status: 'success', message: 'User logged out successfully' })
    } catch (error) {
        next(error)
    }
}

export default {
    postLogin,
    postRegister,
    postLogout
}