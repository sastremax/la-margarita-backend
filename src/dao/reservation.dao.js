import ReservationModel from '../models/reservation.model.js'
import mongoose from 'mongoose'

class ReservationDAO {    

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

    async getReservationSummaryByLodging(lodgingId) {
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

export default ReservationDAO
