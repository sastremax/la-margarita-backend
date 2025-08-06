import dayjs from 'dayjs'
import { LodgingDAO } from '../dao/lodging.dao.js'
import { ReservationDAO } from '../dao/reservation.dao.js'
import { asPublicReservation } from '../dto/reservation.dto.js'

export class ReservationService {
    constructor(reservationDAO, lodgingDAO) {
        this.reservationDAO = reservationDAO
        this.lodgingDAO = lodgingDAO
    }

    async getReservationById(id) {
        const reservation = await this.reservationDAO.getReservationById(id)
        return asPublicReservation(reservation)
    }

    async getReservationsByUserId(userId) {
        const reservations = await this.reservationDAO.getReservationsByUserId(userId)
        return reservations.map(asPublicReservation)
    }

    async getReservationsByLodging(lodgingId) {
        const reservations = await this.reservationDAO.getReservationsByLodging(lodgingId)
        return reservations.map(asPublicReservation)
    }

    async getReservationsWithFilters({ page = 1, limit = 10, userId, lodgingId, status }) {
        const query = {}
        if (userId) query.user = userId
        if (lodgingId) query.lodging = lodgingId
        if (status) query.status = status

        const result = await this.reservationDAO.getReservations(query, { page, limit })
        result.data = result.data.map(asPublicReservation)
        return result
    }

    async createReservation(reservationData) {
        const { userId, lodgingId, checkIn, checkOut } = reservationData

        const lodging = await this.lodgingDAO.getLodgingById(lodgingId)
        if (!lodging?.isActive) {
            throw new Error('Lodging not found or inactive')
        }

        const conflict = await this.reservationDAO.isLodgingAvailable(lodgingId, checkIn, checkOut)
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

        const created = await this.reservationDAO.createReservation(finalReservation)
        return asPublicReservation(created)
    }

    async updateReservation(id, updateData) {
        const reservation = await this.reservationDAO.updateReservation(id, updateData)
        return asPublicReservation(reservation)
    }

    async cancelReservation(id, userId) {
        const reservation = await this.reservationDAO.getReservationById(id)
        if (!reservation) throw new Error('Reservation not found')

        if (String(reservation.user) !== String(userId)) {
            throw new Error('Not authorized to cancel this reservation')
        }

        if (reservation.status === 'cancelled') {
            throw new Error('Reservation already cancelled')
        }

        const updated = await this.reservationDAO.updateReservation(id, { status: 'cancelled' })
        return asPublicReservation(updated)
    }

    async deleteReservation(id) {
        return await this.reservationDAO.deleteReservation(id)
    }

    async getReservationSummary(lodgingId) {
        return await this.reservationDAO.getReservationSummaryByLodging(lodgingId)
    }
}

const reservationDAO = new ReservationDAO()
const lodgingDAO = new LodgingDAO()
export const reservationService = new ReservationService(reservationDAO, lodgingDAO)
