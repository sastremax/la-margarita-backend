import reservationService from '../services/reservation.service.js'

export async function postReservation(req, res, next) {
    try {
        const userId = req.user._id
        const { houseId, checkIn, checkOut } = req.body
        const reservation = await reservationService.createReservation({ userId, houseId, checkIn, checkOut })
        res.status(201).json({ status: 'success', data: reservation })
    } catch (error) {
        next(error)
    }
}

export async function getMyReservations(req, res, next) {
    try {
        const userId = req.user._id
        const reservations = await reservationService.getReservationsByUser(userId)
        res.status(200).json({ status: 'success', data: reservations })
    } catch (error) {
        next(error)
    }
}

export async function deleteReservation(req, res, next) {
    try {
        const userId = req.user._id
        const reservationId = req.params.id
        await reservationService.cancelReservation(reservationId, userId)
        res.status(200).json({ status: 'success', message: 'Reservation cancelled' })
    } catch (error) {
        next(error)
    }
}
