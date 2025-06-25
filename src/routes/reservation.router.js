import express from 'express'
import reservationController from '../controllers/reservation.controller.js'
import { passportWithPolicy } from '../middlewares/authPolicy.middleware.js'
import validateDTO from '../middlewares/validateDTO.middleware.js'
import reservationDTO from '../dto/reservation.dto.js'

const router = express.Router()

router.get('/', passportWithPolicy(['admin']), reservationController.getReservations)
router.get('/summary', passportWithPolicy(['admin']), reservationController.getReservationSummary)
router.get('/user', passportWithPolicy(['user']), reservationController.getReservationsByUser)
router.get('/:rid', passportWithPolicy(['admin']), reservationController.getReservationById)
router.post(
    '/',
    passportWithPolicy(['user']),
    validateDTO(reservationDTO.reservationSchema),
    reservationController.createReservation
)
router.delete(
    '/:rid',
    passportWithPolicy(['user', 'admin']),
    reservationController.cancelReservation
)

export default router