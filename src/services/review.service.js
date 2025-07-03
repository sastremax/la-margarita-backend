import ReviewDAO from '../dao/review.dao.js'
import ReviewModel from '../models/review.model.js'
import ReservationModel from '../models/reservation.model.js'
import asReviewPublic from '../dto/review.dto.js'

class ReviewService {
    static async createReview(reviewData) {
        const { user, lodging, reservation, ...rest } = reviewData

        const existing = await ReviewModel.findOne({ reservation })
        if (existing) {
            const error = new Error('You already reviewed this reservation')
            error.statusCode = 400
            throw error
        }

        const resv = await ReservationModel.findById(reservation)
        if (!resv) {
            const error = new Error('Reservation not found')
            error.statusCode = 404
            throw error
        }

        if (resv.user.toString() !== user) {
            const error = new Error('Forbidden: This reservation is not yours')
            error.statusCode = 403
            throw error
        }

        if (new Date(resv.checkOut) > new Date()) {
            const error = new Error('You can only review after your check-out date')
            error.statusCode = 400
            throw error
        }

        const review = await ReviewDAO.createReview({
            user,
            lodging,
            reservation,
            ...rest
        })

        return asReviewPublic(review)
    }

    static async deleteReview(reviewId, userId) {
        const review = await ReviewModel.findById(reviewId)
        if (!review) {
            const error = new Error('Review not found')
            error.statusCode = 404
            throw error
        }

        if (review.user.toString() !== userId.toString()) {
            const error = new Error('Forbidden')
            error.statusCode = 403
            throw error
        }

        review.isDeleted = true
        await review.save()
    }

    static async getReviewSummary(lodgingId) {
        const reviews = await ReviewModel.find({ lodging: lodgingId, isDeleted: false })

        const total = reviews.length
        const averageRating = total > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / total
            : 0

        return {
            totalReviews: total,
            averageRating: averageRating.toFixed(2)
        }
    }

    static async getReviewsByLodging(lodgingId, { page = 1, limit = 10, filters = {} }) {
        const skip = (page - 1) * limit
        const query = { lodging: lodgingId, isDeleted: false }

        if (filters.hasReply) query['adminReply.message'] = { $ne: null }
        if (filters.minRating !== null && !isNaN(filters.minRating)) {
            query.rating = { $gte: filters.minRating }
        }

        const [total, reviews] = await Promise.all([
            ReviewModel.countDocuments(query),
            ReviewModel.find(query)
                .populate('user', 'firstName lastName country')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
        ])

        return {
            total,
            page,
            limit,
            reviews: reviews.map(asReviewPublic)
        }
    }

    static async getAllReviews({ page = 1, limit = 10 }) {
        const result = await ReviewDAO.getAllReviews({ page, limit })
        result.data = result.data.map(asReviewPublic)
        return result
    }

    static async getReviewById(id) {
        const review = await ReviewDAO.getReviewById(id)
        return asReviewPublic(review)
    }

    static async replyToReview(reviewId, message) {
        const review = await ReviewModel.findById(reviewId)
        if (!review) {
            const error = new Error('Review not found')
            error.statusCode = 404
            throw error
        }

        review.adminReply = {
            message,
            createdAt: new Date()
        }

        await review.save()
        return asReviewPublic(review)
    }
}

export default ReviewService