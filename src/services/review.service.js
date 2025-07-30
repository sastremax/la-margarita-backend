import { ReviewDAO } from '../dao/review.dao.js'
import { reviewDTO } from '../dto/review.dto.js'

const reviewDAO = new ReviewDAO()

export const reviewService = {
    async getAllReviews({ page = 1, limit = 10 }) {
        const result = await reviewDAO.getAllReviews({ page, limit })
        result.data = result.data.map(reviewDTO.asPublicReview)
        return result
    },

    async getReviewById(id) {
        const review = await reviewDAO.getReviewById(id)
        return reviewDTO.asPublicReview(review)
    },

    async getReviewsByLodgingId(lodgingId, { page = 1, limit = 10, filters = {} }) {
        const result = await reviewDAO.getReviewsByLodgingWithFilters(lodgingId, { page, limit, filters })
        result.reviews = result.reviews.map(reviewDTO.asPublicReview)
        return result
    },

    async getReviewByReservation(reservationId) {
        return await reviewDAO.getReviewByReservationId(reservationId)
    },

    async createReview(data) {
        const created = await reviewDAO.createReview(data)
        return reviewDTO.asPublicReview(created)
    },

    async updateReview(id, userId, updateData) {
        const review = await reviewDAO.getReviewById(id)
        if (!review) {
            throw new Error('Review not found')
        }

        if (String(review.user?._id || review.user) !== String(userId)) {
            throw new Error('Not authorized to update this review')
        }

        const updated = await reviewDAO.updateReview(id, updateData)
        return reviewDTO.asPublicReview(updated)
    },

    async deleteReview(id) {
        const deleted = await reviewDAO.deleteReview(id)
        return reviewDTO.asPublicReview(deleted)
    },

    async replyToReview(id, message) {
        const replied = await reviewDAO.replyToReview(id, message)
        return reviewDTO.asPublicReview(replied)
    },

    async getReviewSummary(lodgingId) {
        return await reviewDAO.getReviewSummary(lodgingId)
    }
}
