import { asUserPublic } from '../dto/user.dto.js'
import { AuditService } from '../services/audit.service.js'
import {
    loginUser,
    registerUser
} from '../services/auth.service.js'
import { jwtUtil } from '../utils/jwt.util.js'

export const postLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await loginUser(email, password)

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

        await AuditService.logEvent({
            userId: user._id,
            event: 'login',
            success: true,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        })

        res.status(200).json({ status: 'success', data: { user: asUserPublic(user) } })
    } catch (error) {
        await AuditService.logEvent({
            userId: null,
            event: 'login',
            success: false,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        })
        next(error)
    }
}

export const postRegister = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password } = req.body
        const user = await registerUser({ firstName, lastName, email, password })
        res.status(201).json({ status: 'success', data: asUserPublic(user) })
    } catch (error) {
        next(error)
    }
}

export const postLogout = async (req, res, next) => {
    try {
        res.clearCookie('token')
        res.clearCookie('refreshToken')

        await AuditService.logEvent({
            userId: req.user?._id,
            event: 'logout',
            success: true,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        })

        res.status(200).json({ status: 'success', message: 'User logged out successfully' })
    } catch (error) {
        next(error)
    }
}