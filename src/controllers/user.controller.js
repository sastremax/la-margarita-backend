import { asUserPublic } from '../dto/user.dto.js'
import { userService } from '../services/user.service.js'
import { reservationService } from '../services/reservation.service.js'
import { cartService } from '../services/cart.service.js'
import { AuditService } from '../services/audit.service.js'

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers()
        res.status(200).json({ status: 'success', data: users })
    } catch (error) {
        next(error)
    }
}

export const getUserById = async (req, res, next) => {
    try {
        const { uid } = req.params
        const user = await userService.getUserById(uid)
        res.status(200).json({ status: 'success', data: user })
    } catch (error) {
        next(error)
    }
}

export const getCurrentUser = (req, res) => {
    const data = req.user ? asUserPublic(req.user) : null
    res.status(200).json({ status: 'success', data })
}

export const getCurrentUserReservations = async (req, res, next) => {
    try {
        const reservations = await reservationService.getReservationsByUserId(req.user.id)
        res.status(200).json({ status: 'success', data: reservations })
    } catch (error) {
        next(error)
    }
}

export const getCurrentUserCart = async (req, res, next) => {
    try {
        const cart = await cartService.getCartByUserId(req.user.id)
        res.status(200).json({ status: 'success', data: cart ?? null })
    } catch {
        res.status(200).json({ status: 'success', data: null })
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        const { uid } = req.params
        await userService.deleteUser(uid)
        res.status(204).end()
        if (typeof AuditService?.logEvent === 'function') {
            AuditService.logEvent({
                userId: req.user?.id,
                event: 'delete_user',
                success: true,
                ip: req.ip,
                userAgent: req.headers['user-agent']
            }).catch(() => { })
        }
    } catch (error) {
        next(error)
    }
}

export const updateUserRole = async (req, res, next) => {
    try {
        const { uid } = req.params
        const { role } = req.body
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ status: 'error', message: 'Invalid role' })
        }
        const updatedUser = await userService.updateUserRole(uid, role)
        await AuditService.logEvent({
            userId: req.user?.id,
            event: 'update_user_role',
            success: true,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        })
        res.status(200).json({ status: 'success', data: updatedUser })
    } catch (error) {
        next(error)
    }
}

export const updateUser = async (req, res, next) => {
    try {
        const updatedUser = await userService.updateUser(req.params.uid, req.body)
        res.status(200).json({ status: 'success', data: updatedUser })
    } catch (error) {
        next(error)
    }
}
