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

    async getReservations(query = {}, options = {}) {
        const { page = 1, limit = 10 } = options
        const skip = (page - 1) * limit

        const [total, data] = await Promise.all([
            ReservationModel.countDocuments(query),
            ReservationModel.find(query)
                .skip(skip)
                .limit(limit)
                .sort({ checkIn: -1 }) // Más recientes primero
                .populate('user', 'firstName lastName')
                .populate('lodging', 'title location')
        ])

        const pages = Math.ceil(total / limit)

        return { total, page, pages, data }
    }
}

export default ReservationDAO
