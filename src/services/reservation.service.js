import ReservationDAO from '../dao/reservation.dao.js'
import LodgingDAO from '../dao/lodging.dao.js'
import dayjs from 'dayjs'
import asReservationPublic from '../dto/reservation.dto.js'

class ReservationService {
    static async getAllReservations() {
        const reservations = await ReservationDAO.getAllReservations()
        return reservations.map(asReservationPublic)
    }

    static async getReservationById(id) {
        const reservation = await ReservationDAO.getReservationById(id)
        return asReservationPublic(reservation)
    }

    static async getReservationsByUserId(userId) {
        const reservations = await ReservationDAO.getReservationsByUserId(userId)
        return reservations.map(asReservationPublic)
    }

    static async createReservation(reservationData) {
        const { userId, lodgingId, checkIn, checkOut } = reservationData

        const lodging = await LodgingDAO.getLodgingById(lodgingId)
        if (!lodging || !lodging.isActive) {
            throw new Error('Lodging not found or inactive')
        }

        const conflict = await ReservationDAO.isLodgingAvailable(lodgingId, checkIn, checkOut)
        if (conflict) {
            throw new Error('The lodging is not available for the selected dates')
        }

        const nights = dayjs(checkOut).diff(dayjs(checkIn), 'day')
        if (nights < 1) {
            throw new Error('Reservation must be at least 1 night')
        }

        const priceMap = lodging.pricing
        if (!priceMap || priceMap.size === 0) {
            throw new Error('No pricing available for this lodging')
        }

        let totalPrice = 0

        if (priceMap.has(String(nights))) {
            totalPrice = priceMap.get(String(nights))
        } else {
            const maxKey = Math.max(...Array.from(priceMap.keys()).map(Number))
            const basePrice = priceMap.get(String(maxKey))
            const extraNights = nights - maxKey
            const pricePerNight = basePrice / maxKey
            totalPrice = basePrice + (extraNights * pricePerNight)
        }

        const finalReservation = {
            user: userId,
            lodging: lodgingId,
            checkIn,
            checkOut,
            guests: reservationData.guests || 1,
            totalPrice
        }

        const created = await ReservationDAO.createReservation(finalReservation)
        return asReservationPublic(created)
    }

    static async updateReservation(id, updateData) {
        const reservation = await ReservationDAO.updateReservation(id, updateData)
        return asReservationPublic(reservation)
    }

    static async cancelReservation(id, userId) {
        const reservation = await ReservationDAO.getReservationById(id)
        if (!reservation) throw new Error('Reservation not found')

        if (String(reservation.user) !== String(userId)) {
            throw new Error('Not authorized to cancel this reservation')
        }

        if (reservation.status === 'cancelled') {
            throw new Error('Reservation already cancelled')
        }

        const updated = await ReservationDAO.updateReservation(id, { status: 'cancelled' })
        return asReservationPublic(updated)
    }

    static async getReservationsWithFilters({ page = 1, limit = 10, userId, lodgingId, status }) {
        const query = {}
        if (userId) query.user = userId
        if (lodgingId) query.lodging = lodgingId
        if (status) query.status = status

        const result = await ReservationDAO.getReservations(query, { page, limit })
        result.data = result.data.map(asReservationPublic)
        return result
    }

    static async getReservationSummary(lodgingId) {
        return await ReservationDAO.getReservationSummaryByLodging(lodgingId)
    }
}

export default ReservationService