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

export const getReservationsByUser = async (req, res, next) => {
    try {
        const userId = req.user?.id || req.user?._id || req.user?.uid || req.user?.sub
        const data = await reservationService.getReservationsByUser(userId)
        res.status(200).json({ status: 'success', data })
    } catch (error) {
        next(error)
    }
}

export const getReservationById = async (req, res, next) => {
    try {
        const id = req.params?.rid
        const reservation = await reservationService.getReservationById(id)
        const uid = req.user?.id || req.user?._id || req.user?.uid || req.user?.sub
        const role = req.user?.role
        if (role !== 'admin' && reservation.userId !== String(uid)) {
            return res.status(403).json({ status: 'error', message: 'Access denied' })
        }
        res.status(200).json({ status: 'success', data: reservation })
    } catch (error) {
        next(error)
    }
}

export const createReservation = async (req, res, next) => {
    try {
        const uid = req.user?.id || req.user?._id || req.user?.uid || req.user?.sub
        const data = await reservationService.createReservation({ ...req.body, userId: uid })
        res.status(201).json({ status: 'success', data })
    } catch (error) {
        next(error)
    }
}

export const deleteReservation = async (req, res, next) => {
    try {
        const id = req.params?.rid
        await reservationService.deleteReservation(id)
        res.status(200).json({ status: 'success' })
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
