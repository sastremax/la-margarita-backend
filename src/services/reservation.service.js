import dayjs from 'dayjs'
import ReservationDAO from '../dao/reservation.dao.js'
import Lodging from '../models/lodging.model.js'

class ReservationService {
    async getAllReservations() {
        return await ReservationDAO.getAllReservations()
    }

    async getReservationById(id) {
        const reservation = await ReservationDAO.getReservationById(id)
        if (!reservation) throw new Error('Reservation not found')
        return reservation
    }

    async getReservationsByUserId(userId) {
        return await ReservationDAO.getReservationsByUserId(userId)
    }

    async createReservation(data) {
        const { userId, lodgingId, checkIn, checkOut, guests = 1 } = data

        const lodging = await Lodging.findById(lodgingId)
        if (!lodging || !lodging.isActive) {
            throw new Error('Lodging not found or inactive')
        }

        const nights = dayjs(checkOut).diff(dayjs(checkIn), 'day')
        if (nights < 1) {
            throw new Error('Reservation must be at least 1 night')
        }

        const conflict = await ReservationDAO.isLodgingAvailable(lodgingId, checkIn, checkOut)
        if (conflict) {
            throw new Error('The lodging is not available for the selected dates')
        }

        const priceMap = lodging.pricing
        if (!priceMap || typeof priceMap !== 'object' || !Object.keys(priceMap).length) {
            throw new Error('No pricing available for this lodging')
        }

        let totalPrice = 0
        const priceKey = String(nights)

        if (priceMap[priceKey]) {
            totalPrice = priceMap[priceKey]
        } else {
            const numericKeys = Object.keys(priceMap).map(Number)
            const maxKey = Math.max(...numericKeys)
            const basePrice = priceMap[String(maxKey)]
            const pricePerNight = basePrice / maxKey
            const extraNights = nights - maxKey
            totalPrice = basePrice + (extraNights * pricePerNight)
        }

        const reservation = {
            user: userId,
            lodging: lodgingId,
            checkIn,
            checkOut,
            guests,
            totalPrice,
            status: 'confirmed'
        }

        return await ReservationDAO.createReservation(reservation)
    }

    async updateReservation(id, updateData) {
        const updated = await ReservationDAO.updateReservation(id, updateData)
        if (!updated) throw new Error('Reservation not found')
        return updated
    }

    async cancelReservation(id, userId) {
        const reservation = await ReservationDAO.getReservationById(id)
        if (!reservation) throw new Error('Reservation not found')

        if (reservation.user.toString() !== userId.toString()) {
            throw new Error('Not authorized to cancel this reservation')
        }

        if (reservation.status === 'cancelled') {
            throw new Error('Reservation already cancelled')
        }

        return await ReservationDAO.updateReservation(id, { status: 'cancelled' })
    }

    async getReservationsWithFilters({ page = 1, limit = 10, userId, lodgingId, status }) {
        const query = {}
        if (userId) query.user = userId
        if (lodgingId) query.lodging = lodgingId
        if (status) query.status = status

        return await ReservationDAO.getReservations(query, { page, limit })
    }

    async getReservationSummary(lodgingId) {
        const summary = await ReservationDAO.getReservationSummaryByLodging(lodgingId)
        if (!summary) throw new Error('Invalid lodging ID')
        return summary
    }
}

export default new ReservationService()