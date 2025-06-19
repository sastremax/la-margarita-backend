import reservationService from '../services/reservation.service.js'
import { asPublicReservation } from '../dto/reservation.dto.js'

export async function getReservations(req, res, next) {
    try {
        const { page = 1, limit = 10, userId, lodgingId, status } = req.query
        const reservations = await reservationService.getReservationsWithFilters({ page, limit, userId, lodgingId, status })
        const data = reservations.data.map(asPublicReservation)

        res.status(200).json({
            status: 'success',
            total: reservations.total,
            page: reservations.page,
            pages: reservations.pages,
            data
        })
    } catch (error) {
        next(error)
    }
}

export async function postReservation(req, res, next) {
    try {
        const userId = req.user._id
        const { houseId, checkIn, checkOut } = req.body
        const reservation = await reservationService.createReservation({ userId, houseId, checkIn, checkOut })
        res.status(201).json({ status: 'success', data: asPublicReservation(reservation) })
    } catch (error) {
        next(error)
    }
}

export async function getMyReservations(req, res, next) {
    try {
        const userId = req.user._id
        const reservations = await reservationService.getReservationsByUser(userId)
        res.status(200).json({ status: 'success', data: reservations.map(asPublicReservation) })
    } catch (error) {
        next(error)
    }
}

export async function deleteReservation(req, res, next) {
    try {
        const userId = req.user._id
        const reservationId = req.params.id
        await reservationService.cancelReservation(reservationId, userId)
        res.status(200).json({ status: 'success', data: { message: 'Reservation cancelled' } })
    } catch (error) {
        next(error)
    }
}
