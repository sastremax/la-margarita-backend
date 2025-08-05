import express from 'express'
import {
    getReservations,
    getReservationSummary,
    createReservation,
    getReservationsByUser,
    deleteReservation,
    getReservationById
} from '../controllers/reservation.controller.js'
import { authPolicy } from '../middlewares/authPolicy.middleware.js'
import { validateDTO } from '../middlewares/validateDTO.middleware.js'
import {
    reservationSchema,
    reservationQuerySchema
} from '../dto/reservation.dto.js'
import { validateReservationExists } from '../middlewares/exists/validateReservationExists.js'
import { verifyOwnership } from '../middlewares/verifyOwnership.js'
import { reservationService } from '../services/reservation.service.js'
import { param } from 'express-validator'
import { validateRequest } from '../middlewares/validateRequest.middleware.js'

export const reservationRouter = express.Router()

reservationRouter.get(
    '/',
    authPolicy(['admin']),
    validateDTO(reservationQuerySchema, 'query'),
    getReservations
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
    verifyOwnership(async (req) => {
        const reservation = await reservationService.getReservationById(req.params.rid)
        return reservation?.userId
    }),
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
