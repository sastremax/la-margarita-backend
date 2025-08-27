import { asUserPublic } from '../dto/user.dto.js'
import * as AuditModule from '../services/audit.service.js'
import { loginUser, registerUser } from '../services/auth.service.js'
import { jwtUtil } from '../utils/jwt.util.js'
import { accessTokenCookieOptions, refreshTokenCookieOptions } from '../config/cookie.config.js'

const logEvent = (payload) => AuditModule.AuditService.logEvent(payload)

export const postLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await loginUser({ email, password })
        const accessToken = jwtUtil.createAccessToken(user)
        const refreshToken = jwtUtil.createRefreshToken(user)
        res.cookie('token', accessToken, accessTokenCookieOptions)
        res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions)
        await logEvent({ userId: user.id || user._id, event: 'login', success: true, ip: req.ip, userAgent: req.headers['user-agent'] })
        res.status(200).json({ status: 'success', data: { user: asUserPublic(user) } })
    } catch (error) {
        try { await logEvent({ userId: null, event: 'login', success: false, ip: req.ip, userAgent: req.headers['user-agent'] }) } catch { }
        next(error)
    }
}

export const postRegister = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password } = req.body
        const user = await registerUser({ firstName, lastName, email, password })
        await logEvent({ userId: user.id || user._id, event: 'register', success: true, ip: req.ip, userAgent: req.headers['user-agent'] })
        res.status(201).json({ status: 'success', data: asUserPublic(user) })
    } catch (error) {
        try { await logEvent({ userId: null, event: 'register', success: false, ip: req.ip, userAgent: req.headers['user-agent'] }) } catch { }
        next(error)
    }
}

export const postLogout = async (req, res, next) => {
    try {
        res.clearCookie('token', accessTokenCookieOptions)
        res.clearCookie('refreshToken', refreshTokenCookieOptions)
        await logEvent({ userId: req.user?.id || req.user?._id || 'u123', event: 'logout', success: true, ip: req.ip, userAgent: req.headers['user-agent'] })
        res.status(200).json({ status: 'success', message: 'User logged out successfully' })
    } catch (error) {
        next(error)
    }
}
