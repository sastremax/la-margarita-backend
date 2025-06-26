import reservationService from '../services/reservation.service.js'
import reservationDTO from '../dto/reservation.dto.js'
import ApiError from '../utils/apiError.js'
import auditService from '../services/audit.service.js'

const getReservations = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, userId, lodgingId, status } = req.query
        const reservations = await reservationService.getReservationsWithFilters({ page, limit, userId, lodgingId, status })
        const data = reservations.data.map(reservationDTO.asPublicReservation)

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

const getReservationSummary = async (req, res, next) => {
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

const createReservation = async (req, res, next) => {
    try {
        const userId = req.user._id
        const { lodgingId, checkIn, checkOut } = req.body
        const reservation = await reservationService.createReservation({ userId, lodgingId, checkIn, checkOut })
        res.status(201).json({ status: 'success', data: reservationDTO.asPublicReservation(reservation) })
    } catch (error) {
        next(error)
    }
}

const getReservationsByUser = async (req, res, next) => {
    try {
        const userId = req.user._id
        const reservations = await reservationService.getReservationsByUser(userId)
        res.status(200).json({ status: 'success', data: reservations.map(reservationDTO.asPublicReservation) })
    } catch (error) {
        next(error)
    }
}

const deleteReservation = async (req, res, next) => {
    try {
        const userId = req.user._id
        const reservationId = req.params.id

        await reservationService.cancelReservation(reservationId, userId)

        await auditService.logEvent({
            userId,
            event: 'cancel_reservation',
            success: true,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        })

        res.status(200).json({ status: 'success', data: { message: 'Reservation cancelled' } })
    } catch (error) {
        next(error)
    }
}

const getReservationById = async (req, res, next) => {
    try {
        const reservationId = req.params.rid
        const reservation = await reservationService.getReservationById(reservationId)

        if (!reservation) {
            return next(new ApiError(404, 'Reservation not found'))
        }

        res.status(200).json({ status: 'success', data: reservationDTO.asPublicReservation(reservation) })
    } catch (error) {
        next(error)
    }
}

export default {
    getReservations,
    getReservationSummary,
    createReservation,
    getReservationsByUser,
    deleteReservation,
    getReservationById
}