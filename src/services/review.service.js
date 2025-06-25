import ReviewDAO from '../dao/review.dao.js'

const reviewDAO = new ReviewDAO()

class ReviewService {
    async getReviewsByLodging(lodgingId, { page = 1, limit = 10, filters = {} }) {
        return await reviewDAO.getReviewsByLodging(lodgingId, filters, { page, limit })
    }

    async getReviewSummary(lodgingId) {
        const { reviews } = await reviewDAO.getReviewsByLodging(lodgingId)
        const total = reviews.length
        const averageRating = total > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / total
            : 0

        return { totalReviews: total, averageRating: averageRating.toFixed(2) }
    }

    async deleteReview(reviewId, userId) {
        const review = await reviewDAO.getReviewById(reviewId)

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

        return await reviewDAO.deleteReview(reviewId)
    }

    async replyToReview(reviewId, message) {
        const review = await reviewDAO.getReviewById(reviewId)

        if (!review) {
            const error = new Error('Review not found')
            error.statusCode = 404
            throw error
        }

        return await reviewDAO.replyToReview(reviewId, message)
    }
}

export default new ReviewService()