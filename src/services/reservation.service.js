import ReservationDAO from '../dao/reservation.dao.js'

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
        return await ReservationDAO.createReservation(reservationData)
    }

    static async updateReservation(id, updateData) {
        return await ReservationDAO.updateReservation(id, updateData)
    }

    static async deleteReservation(id) {
        return await ReservationDAO.deleteReservation(id)
    }
}

export default ReservationService
