import mongoose from 'mongoose'
import ReviewModel from '../models/review.model.js'

export class ReviewDAO {
    async getAllReviews({ page = 1, limit = 10 }) {
        const skip = (page - 1) * limit

        const [total, data] = await Promise.all([
            ReviewModel.countDocuments({ isDeleted: false }),
            ReviewModel.find({ isDeleted: false })
                .populate('user', 'firstName lastName country')
                .populate('lodging', 'title location')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
        ])

        const pages = Math.ceil(total / limit)
        return { total, page, pages, data }
    }

    async getReviewById(id) {
        return await ReviewModel.findById(id)
            .populate('user', 'firstName lastName country')
            .populate('lodging', 'title location')
    }

    async getReviewByReservationId(reservationId) {
        return await ReviewModel.findOne({ reservation: reservationId })
    }

    async createReview(reviewData) {
        return await ReviewModel.create(reviewData)
    }

    async deleteReview(reviewId) {
        const review = await ReviewModel.findById(reviewId)
        if (!review) return null

        review.isDeleted = true
        await review.save()
        return review
    }

    async replyToReview(reviewId, message) {
        const review = await ReviewModel.findById(reviewId)
        if (!review) return null

        review.adminReply = {
            message,
            createdAt: new Date()
        }

        await review.save()
        return review
    }

    async getReviewSummary(lodgingId) {
        const id = String(lodgingId)

        if (!mongoose.isValidObjectId(id)) {
            return {
                totalReviews: 0,
                averageRating: '0.00'
            }
        }

        const [totalReviews, avgResult] = await Promise.all([
            ReviewModel.countDocuments({ lodging: id, isDeleted: false }),
            ReviewModel.aggregate([
                {
                    $match: {
                        lodging: new mongoose.Types.ObjectId(id),
                        isDeleted: false
                    }
                },
                {
                    $group: {
                        _id: null,
                        avgRating: { $avg: '$rating' }
                    }
                }
            ])
        ])

        const averageRating = avgResult[0]?.avgRating || 0
        return {
            totalReviews,
            averageRating: averageRating.toFixed(2)
        }
    }

    async getReviewsByLodgingWithFilters(lodgingId, { page = 1, limit = 10, filters = {} }) {
        const skip = (page - 1) * limit

        const safeFilters = typeof filters === 'object' && filters !== null ? filters : {}
        const query = { lodging: lodgingId, isDeleted: false }

        if (safeFilters.hasReply) {
            query['adminReply.message'] = { $ne: null }
        }

        if (safeFilters.minRating !== null && !Number.isNaN(safeFilters.minRating)) {
            query.rating = { $gte: safeFilters.minRating }
        }

        const [total, reviews] = await Promise.all([
            ReviewModel.countDocuments(query),
            ReviewModel.find(query)
                .populate('user', 'firstName lastName country')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
        ])

        return { total, page, limit, reviews }
    }

    async getReviewsWithReplyByLodging(lodgingId) {
        return await ReviewModel.find({
            lodging: lodgingId,
            isDeleted: false,
            'adminReply.message': { $ne: null }
        }).populate('user', 'firstName lastName country')
    }

    async updateReview(reviewId, updateData) {
        const review = await ReviewModel.findById(reviewId)
        if (!review || review.isDeleted) return null

        Object.assign(review, updateData)

        await review.save()
        return review
    }
}
