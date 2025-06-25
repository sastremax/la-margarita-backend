import express from 'express'
import reservationController from '../controllers/reservation.controller.js'
import authPolicy from '../middlewares/authPolicy.middleware.js'
import validateDTO from '../middlewares/validateDTO.middleware.js'
import reservationDTO from '../dto/reservation.dto.js'

const router = express.Router()

router.get('/', authPolicy(['admin']), reservationController.getReservations)
router.get('/summary', authPolicy(['admin']), reservationController.getReservationSummary)
router.get('/user', authPolicy(['user']), reservationController.getReservationsByUser)
router.get('/:rid', authPolicy(['admin']), reservationController.getReservationById)
router.post('/', authPolicy(['user']), validateDTO(reservationDTO.reservationSchema), reservationController.createReservation)
router.delete('/:rid', authPolicy(['admin']), reservationController.deleteReservation)

export default router