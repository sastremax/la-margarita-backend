import { ReviewDAO } from '../dao/review.dao.js'
import { asPublicReview } from '../dto/review.dto.js'

const reviewDAO = new ReviewDAO()

export class ReviewService {
    static async getAllReviews({ page = 1, limit = 10 }) {
        const result = await reviewDAO.getAllReviews({ page, limit })
        result.data = result.data.map(asPublicReview)
        return result
    }

    static async getReviewById(id) {
        const review = await reviewDAO.getReviewById(id)
        return asPublicReview(review)
    }

    static async getReviewsByLodgingId(lodgingId, { page = 1, limit = 10, filters = {} }) {
        const result = await reviewDAO.getReviewsByLodgingWithFilters(lodgingId, { page, limit, filters })
        result.reviews = result.reviews.map(asPublicReview)
        return result
    }

    static async getReviewByReservation(reservationId) {
        return await reviewDAO.getReviewByReservationId(reservationId)
    }

    static async createReview(data) {
        const created = await reviewDAO.createReview(data)
        return asPublicReview(created)
    }

    static async deleteReview(id) {
        const deleted = await reviewDAO.deleteReview(id)
        return asPublicReview(deleted)
    }

    static async replyToReview(id, message) {
        const replied = await reviewDAO.replyToReview(id, message)
        return asPublicReview(replied)
    }

    static async getReviewSummary(lodgingId) {
        return await reviewDAO.getReviewSummary(lodgingId)
    }
}
