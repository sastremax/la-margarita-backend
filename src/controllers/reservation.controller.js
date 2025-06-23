import reservationService from '../services/reservation.service.js'
import asPublicReservation from '../dto/reservation.dto.js'

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

export async function getReservationSummary(req, res, next) {
    try {
        const { lodgingId } = req.query
        if (!lodgingId) {
            return res.status(400).json({ status: 'error', message: 'lodgingId is required' })
        }

        const summary = await reservationService.getReservationSummary(lodgingId)
        res.status(200).json({ status: 'success', data: summary })
    } catch (error) {
        next(error)
    }
}

export async function createReservation(req, res, next) {
    try {
        const userId = req.user._id
        const { houseId, checkIn, checkOut } = req.body
        const reservation = await reservationService.createReservation({ userId, houseId, checkIn, checkOut })
        res.status(201).json({ status: 'success', data: asPublicReservation(reservation) })
    } catch (error) {
        next(error)
    }
}

export async function getReservationsByUser(req, res, next) {
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

export async function getReservationById(req, res, next) {
    try {
        const reservationId = req.params.rid
        const reservation = await reservationService.getReservationById(reservationId)

        if (!reservation) {
            return res.status(404).json({ status: 'error', message: 'Reservation not found' })
        }

        res.status(200).json({ status: 'success', data: asPublicReservation(reservation) })
    } catch (error) {
        next(error)
    }
}
