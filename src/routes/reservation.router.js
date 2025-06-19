import express from 'express';
import * as reservationController from '../controllers/reservation.controller.js';
import { passportWithPolicy } from '../middlewares/authPolicy.middleware.js';

const router = express.Router();

router.get('/', passportWithPolicy(['admin']), reservationController.getAllReservations);
router.get('/:rid', passportWithPolicy(['admin']), reservationController.getReservationById);
router.post('/', passportWithPolicy(['user']), reservationController.createReservation);
router.delete('/:rid', passportWithPolicy(['admin']), reservationController.deleteReservation);

export default router;
