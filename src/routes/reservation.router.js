import express from 'express'
import { param } from 'express-validator'

import {
    createReservation,
    deleteReservation,
    getAllReservations,
    getReservationById,
    getReservationSummary,
    getReservationsByUser
} from '../controllers/reservation.controller.js'
import { reservationQuerySchema, reservationSchema } from '../dto/reservation.dto.js'
import { authPolicy } from '../middlewares/authPolicy.middleware.js'
import { validateReservationExists } from '../middlewares/exists/validateReservationExists.js'
import { validateDTO } from '../middlewares/validateDTO.middleware.js'
import { validateRequest } from '../middlewares/validateRequest.middleware.js'
import { ApiError } from '../utils/apiError.js'

export const reservationRouter = express.Router()

const ensureOwnerOrAdmin = (req, res, next) => {
    if (req.user?.role === 'admin') return next()
    const r = req.reservation
    const ownerId =
        r?.user?._id?.toString?.() ||
        r?.user?.toString?.() ||
        r?.user?.id ||
        r?.userId?.toString?.() ||
        r?.userId ||
        null
    if (req.user?.id && ownerId && req.user.id === ownerId) return next()
    next(new ApiError(403, 'Access denied'))
}

reservationRouter.get(
    '/',
    authPolicy(['admin']),
    validateDTO(reservationQuerySchema, 'query'),
    getAllReservations
)

reservationRouter.get(
    '/summary',
    authPolicy(['admin']),
    getReservationSummary
)

reservationRouter.get(
    '/user',
    authPolicy(['user']),
    getReservationsByUser
)

reservationRouter.get(
    '/:rid',
    param('rid').isMongoId().withMessage('Invalid reservation ID'),
    validateRequest,
    authPolicy(['admin', 'user']),
    validateReservationExists,
    ensureOwnerOrAdmin,
    getReservationById
)

reservationRouter.post(
    '/',
    authPolicy(['user']),
    validateDTO(reservationSchema),
    createReservation
)

reservationRouter.delete(
    '/:rid',
    param('rid').isMongoId().withMessage('Invalid reservation ID'),
    validateRequest,
    authPolicy(['admin']),
    deleteReservation
)
