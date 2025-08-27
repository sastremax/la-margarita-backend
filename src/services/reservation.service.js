import dayjs from 'dayjs'
import { LodgingDAO } from '../dao/lodging.dao.js'
import { ReservationDAO } from '../dao/reservation.dao.js'
import { asPublicReservation } from '../dto/reservation.dto.js'
import { ApiError } from '../utils/apiError.js'
import { calculateTotalPrice } from '../utils/reservation.utils.js'

export class ReservationService {
    constructor(reservationDAO, lodgingDAO) {
        this.reservationDAO = reservationDAO
        this.lodgingDAO = lodgingDAO
    }

    async getReservationById(id) {
        const reservation = await this.reservationDAO.getReservationById(id)
        if (!reservation) throw new ApiError(404, 'Reservation not found')
        return asPublicReservation(reservation)
    }

    async getReservationsByUser(userId) {
        const reservations = await this.reservationDAO.getReservationsByUserId(userId)
        return reservations.map(asPublicReservation)
    }

    async getReservationsByUserId(userId) {
        return await this.getReservationsByUser(userId)
    }

    async getReservationsWithFilters({ page = 1, limit = 10, userId, lodgingId, status }) {
        const query = {}
        if (userId) query.user = userId
        if (lodgingId) query.lodging = lodgingId
        if (status) query.status = status
        const result = await this.reservationDAO.getReservations(query, { page, limit })
        return {
            total: result.total,
            page: result.page,
            pages: result.pages,
            data: result.data.map(asPublicReservation)
        }
    }

    async createReservation(data) {
        const { userId, lodgingId, checkIn, checkOut, guests } = data
        if (!userId) throw new ApiError(400, 'User ID is required')
        const lodging = await this.lodgingDAO.getLodgingById(lodgingId)
        if (!lodging || lodging.isActive === false) throw new ApiError(400, 'Lodging not found or inactive')
        const overlap = await this.reservationDAO.isLodgingAvailable(lodgingId, new Date(checkIn), new Date(checkOut))
        if (overlap) throw new ApiError(400, 'The lodging is not available for the selected dates')
        const totalPrice = calculateTotalPrice(lodging.pricing, checkIn, checkOut)
        const payload = {
            user: userId,
            lodging: lodgingId,
            checkIn: new Date(checkIn),
            checkOut: new Date(checkOut),
            guests: guests || 1,
            totalPrice,
            status: 'confirmed'
        }
        const created = await this.reservationDAO.createReservation(payload)
        return asPublicReservation(created)
    }

    async updateReservation(id, updateData) {
        const updated = await this.reservationDAO.updateReservation(id, updateData)
        if (!updated) throw new ApiError(404, 'Reservation not found')
        return asPublicReservation(updated)
    }

    async cancelReservation(id, userId) {
        const reservation = await this.reservationDAO.getReservationById(id)
        if (!reservation) throw new ApiError(404, 'Reservation not found')
        if (String(reservation.user) !== String(userId)) throw new ApiError(403, 'Not authorized to cancel this reservation')
        if (reservation.status === 'cancelled') throw new ApiError(400, 'Reservation already cancelled')
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
