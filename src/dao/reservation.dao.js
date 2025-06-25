import mongoose from 'mongoose'
import ReservationModel from '../models/reservation.model.js'

class ReservationDAO {
    async getAllReservations() {
        return await ReservationModel.find()
    }

    async getReservationById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) return null
        return await ReservationModel.findById(id)
    }

    async getReservationsByUserId(userId) {
        if (!mongoose.Types.ObjectId.isValid(userId)) return []
        return await ReservationModel.find({ user: userId })
    }

    async createReservation(data) {
        return await ReservationModel.create(data)
    }

    async updateReservation(id, updateData) {
        if (!mongoose.Types.ObjectId.isValid(id)) return null
        return await ReservationModel.findByIdAndUpdate(id, updateData, { new: true })
    }

    async deleteReservation(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) return null
        return await ReservationModel.findByIdAndDelete(id)
    }

    async isLodgingAvailable(lodgingId, checkIn, checkOut) {
        if (!mongoose.Types.ObjectId.isValid(lodgingId)) return false
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
                .sort({ checkIn: -1 })
                .populate('user', 'firstName lastName')
                .populate('lodging', 'title location')
        ])

        const pages = Math.ceil(total / limit)

        return { total, page, pages, data }
    }

    async getReservationSummaryByLodging(lodgingId) {
        if (!mongoose.Types.ObjectId.isValid(lodgingId)) return null

        const results = await ReservationModel.aggregate([
            { $match: { lodging: new mongoose.Types.ObjectId(lodgingId), status: 'confirmed' } },
            {
                $project: {
                    nights: {
                        $dateDiff: {
                            startDate: '$checkIn',
                            endDate: '$checkOut',
                            unit: 'day'
                        }
                    },
                    totalPrice: 1
                }
            },
            {
                $group: {
                    _id: null,
                    totalReservations: { $sum: 1 },
                    totalNights: { $sum: '$nights' },
                    totalRevenue: { $sum: '$totalPrice' },
                    averageDuration: { $avg: '$nights' }
                }
            }
        ])

        if (results.length === 0) {
            return {
                lodgingId,
                totalReservations: 0,
                totalNights: 0,
                totalRevenue: 0,
                averageDuration: 0
            }
        }

        const summary = results[0]
        return {
            lodgingId,
            totalReservations: summary.totalReservations,
            totalNights: summary.totalNights,
            totalRevenue: summary.totalRevenue,
            averageDuration: Math.round(summary.averageDuration)
        }
    }
}

export default new ReservationDAO()