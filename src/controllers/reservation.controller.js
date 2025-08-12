import { reservationService } from '../services/reservation.service.js'

export const getAllReservations = async (req, res, next) => {
    try {
        const filters = req.query || {}
        const result = await reservationService.getReservationsWithFilters(filters)
        res.status(200).json({
            status: 'success',
            total: result.total,
            page: result.page,
            pages: result.pages,
            data: result.data
        })
    } catch (error) {
        next(error)
    }
}

export const getReservationById = async (req, res, next) => {
    try {
        const reservation = await reservationService.getReservationById(req.params.rid)
        res.status(200).json({ status: 'success', data: reservation })
    } catch (error) {
        next(error)
    }
}

export const getReservationsByLodging = async (req, res, next) => {
    try {
        const reservations = await reservationService.getReservationsByLodging(req.params.lid)
        res.status(200).json({ status: 'success', data: reservations })
    } catch (error) {
        next(error)
    }
}

export const getReservationsByUser = async (req, res, next) => {
    try {
        const reservations = await reservationService.getReservationsByUserId(req.user.id)
        res.status(200).json({ status: 'success', data: reservations })
    } catch (error) {
        next(error)
    }
}

export const createReservation = async (req, res, next) => {
    try {
        const reservation = await reservationService.createReservation(req.body)
        res.status(201).json({ status: 'success', data: reservation })
    } catch (error) {
        next(error)
    }
}

export const updateReservation = async (req, res, next) => {
    try {
        const updated = await reservationService.updateReservation(req.params.rid, req.body)
        res.status(200).json({ status: 'success', data: updated })
    } catch (error) {
        next(error)
    }
}

export const cancelReservation = async (req, res, next) => {
    try {
        const updated = await reservationService.cancelReservation(req.params.rid, req.user.id)
        res.status(200).json({ status: 'success', data: updated })
    } catch (error) {
        next(error)
    }
}

export const deleteReservation = async (req, res, next) => {
    try {
        await reservationService.deleteReservation(req.params.rid)
        res.status(204).end()
    } catch (error) {
        next(error)
    }
}

export const getReservationSummary = async (req, res, next) => {
    try {
        const lodgingId = req.query?.lodgingId
        if (!lodgingId) {
            return res.status(400).json({ status: 'error', message: 'lodgingId is required' })
        }
        const summary = await reservationService.getReservationSummary(lodgingId)
        res.status(200).json({ status: 'success', data: summary })
    } catch (error) {
        next(error)
    }
}
