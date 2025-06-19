import express from 'express'
import * as reservationController from '../controllers/reservation.controller.js'
import { passportWithPolicy } from '../middlewares/authPolicy.middleware.js'
import validateDTO from '../middlewares/validateDTO.middleware.js'
import { reservationSchema } from '../dto/reservation.dto.js'

const router = express.Router()

router.get('/', passportWithPolicy(['admin']), reservationController.getReservations)
router.get('/summary', passportWithPolicy(['admin']), reservationController.getReservationSummary)
router.get('/user', passportWithPolicy(['user']), reservationController.getReservationsByUser)
router.get('/:rid', passportWithPolicy(['admin']), reservationController.getReservationById)
router.post('/', passportWithPolicy(['user']), validateDTO(reservationSchema), reservationController.createReservation)
router.delete('/:rid', passportWithPolicy(['admin']), reservationController.deleteReservation)

export default router