import ReviewDAO from '../dao/review.dao.js'
import ReviewModel from '../models/review.model.js'
import asReviewPublic from '../dto/review.dto.js'

class ReviewService {

    static async getReviewById(id) {
        const review = await ReviewDAO.getReviewById(id)
        return asReviewPublic(review)
    }
    
    static async getReviewsByLodging(lodgingId, { page = 1, limit = 10, filters = {} }) {
        const skip = (page - 1) * limit
        const query = { lodging: lodgingId }

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

    static async getReviewSummary(lodgingId) {
        const reviews = await ReviewDAO.getReviewsByLodgingId(lodgingId)

        const total = reviews.length
        const averageRating = total > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / total
            : 0

        return {
            totalReviews: total,
            averageRating: averageRating.toFixed(2)
        }
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

        await ReviewModel.findByIdAndDelete(reviewId)
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

    static async getAllReviews({ page = 1, limit = 10 }) {
        const result = await ReviewDAO.getAllReviews({ page, limit })
        result.data = result.data.map(asReviewPublic)
        return result
    }
    
}

export default ReviewService