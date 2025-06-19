import ReservationModel from '../models/reservation.model.js'

class ReservationDAO {
    async getAllReservations() {
        return await ReservationModel.find()
    }

    async getReservationById(id) {
        return await ReservationModel.findById(id)
    }

    async getReservationsByUserId(userId) {
        return await ReservationModel.find({ user: userId })
    }

    async createReservation(reservationData) {
        return await ReservationModel.create(reservationData)
    }

    async updateReservation(id, updateData) {
        return await ReservationModel.findByIdAndUpdate(id, updateData, { new: true })
    }

    async deleteReservation(id) {
        return await ReservationModel.findByIdAndDelete(id)
    }

    async isLodgingAvailable(lodgingId, checkIn, checkOut) {
        return await ReservationModel.findOne({
            lodging: lodgingId,
            status: 'confirmed',
            $or: [
                {
                    checkIn: { $lt: checkOut },
                    checkOut: { $gt: checkIn }
                }
            ]
        })
    }
}

export default ReservationDAO
