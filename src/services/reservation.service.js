import ReservationDAO from '../dao/reservation.dao.js'
import Lodging from '../models/lodging.model.js'
import dayjs from 'dayjs'

class ReservationService {
    static async getAllReservations() {
        return await ReservationDAO.getAllReservations()
    }

    static async getReservationById(id) {
        return await ReservationDAO.getReservationById(id)
    }

    static async getReservationsByUserId(userId) {
        return await ReservationDAO.getReservationsByUserId(userId)
    }

    static async createReservation(reservationData) {
        const { userId, lodgingId, checkIn, checkOut } = reservationData

        const lodging = await Lodging.findById(lodgingId)
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

        return await ReservationDAO.createReservation(finalReservation)
    }

    static async updateReservation(id, updateData) {
        return await ReservationDAO.updateReservation(id, updateData)
    }

    static async cancelReservation(id, userId) {
        const reservation = await ReservationDAO.getReservationById(id)
        if (!reservation) {
            throw new Error('Reservation not found')
        }

        if (String(reservation.user) !== String(userId)) {
            throw new Error('Not authorized to cancel this reservation')
        }

        if (reservation.status === 'cancelled') {
            throw new Error('Reservation already cancelled')
        }

        return await ReservationDAO.updateReservation(id, { status: 'cancelled' })
    }
}

export default ReservationService