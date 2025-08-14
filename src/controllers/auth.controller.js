import { logger } from '../config/logger.js'
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
        const user = await loginUser({ email, password })

        const accessToken = jwtUtil.createAccessToken(user)
        const refreshToken = jwtUtil.createRefreshToken(user)

        res.cookie('token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 15 * 60 * 1000
        })

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
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
        try {
            await AuditService.logEvent({
                userId: null,
                event: 'login',
                success: false,
                ip: req.ip,
                userAgent: req.headers['user-agent']
            })
        } catch { }
        next(error)
    }
}

export const postLogout = async (req, res, next) => {
    try {
        res.clearCookie('token', { path: '/' })
        res.clearCookie('refreshToken', { path: '/' })

        await AuditService.logEvent({
            userId: req.user?._id || null,
            event: 'logout',
            success: true,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        })

        res.status(200).json({ status: 'success', message: 'User logged out successfully' })
    } catch (error) {
        try {
            await AuditService.logEvent({
                userId: req.user?._id || null,
                event: 'logout',
                success: false,
                ip: req.ip,
                userAgent: req.headers['user-agent']
            })
        } catch { }
        next(error)
    }
}

export const postRegister = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password } = req.body
        const user = await registerUser({ firstName, lastName, email, password })

        await AuditService.logEvent({
            userId: user.id || user._id,
            event: 'register',
            success: true,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        })

        res.status(201).json({ status: 'success', data: asUserPublic(user) })
    } catch (error) {
        try {
            await AuditService.logEvent({
                userId: null,
                event: 'register',
                success: false,
                ip: req.ip,
                userAgent: req.headers['user-agent']
            })
        } catch (auditError) {
            logger.warn('Failed to log failed register attempt', auditError)
        }

        next(error)
    }
}

