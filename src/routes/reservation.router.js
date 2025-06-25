import express from 'express'
import * as reservationController from '../controllers/reservation.controller.js'

const router = express.Router()

router.get('/', reservationController.getAllReservations)
router.get('/:rid', reservationController.getReservationById)
router.post('/', reservationController.createReservation)
router.delete('/:rid', reservationController.deleteReservation)

export default router

