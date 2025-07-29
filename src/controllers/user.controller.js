import { AuditService } from '../services/audit.service.js'
import { cartService } from '../services/cart.service.js'
import { reservationService } from '../services/reservation.service.js'
import { userService } from '../services/user.service.js'
import { asUserPublic } from '../dto/user.dto.js'

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers()
        const publicUsers = users.map(asUserPublic)
        res.status(200).json({ status: 'success', data: publicUsers })
    } catch (error) {
        next(error)
    }
}

export const getUserById = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.id)
        res.status(200).json({ status: 'success', data: asUserPublic(user) })
    } catch (error) {
        next(error)
    }
}

export const updateUser = async (req, res, next) => {
    try {
        const updatedUser = await userService.updateUser(req.params.id, req.body)
        res.status(200).json({ status: 'success', data: asUserPublic(updatedUser) })
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        await userService.deleteUser(req.params.id)
        res.status(204).end()
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
            userId: req.user?._id,
            event: 'update_user_role',
            success: true,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        })

        res.status(200).json({ status: 'success', data: asUserPublic(updatedUser) })
    } catch (error) {
        next(error)
    }
}

export const getCurrentUser = (req, res) => {
    res.json({
        status: 'success',
        data: {
            user: req.user
        }
    })
}

export const getCurrentUserReservations = async (req, res, next) => {
    try {
        const reservations = await reservationService.getReservationsByUserId(req.user.id)
        res.json({
            status: 'success',
            data: {
                reservations
            }
        })
    } catch (error) {
        next(error)
    }
}

export const getCurrentUserCart = async (req, res, next) => {
    try {
        const cart = await cartService.getCartByUserId(req.user.id)
        res.json({
            status: 'success',
            data: {
                cart
            }
        })
    } catch (error) {
        next(error)
    }
}
