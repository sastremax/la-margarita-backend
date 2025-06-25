import ReservationModel from '../models/reservation.model.js'

class ReservationDAO {
    static async getAllReservations() {
        return await ReservationModel.find()
    }

    static async getReservationById(id) {
        return await ReservationModel.findById(id)
    }

    static async getReservationsByUserId(userId) {
        return await ReservationModel.find({ user: userId })
    }

    static async createReservation(reservationData) {
        return await ReservationModel.create(reservationData)
    }

    static async updateReservation(id, updateData) {
        return await ReservationModel.findByIdAndUpdate(id, updateData, { new: true })
    }

    static async deleteReservation(id) {
        return await ReservationModel.findByIdAndDelete(id)
    }
}

export default ReservationDAO
