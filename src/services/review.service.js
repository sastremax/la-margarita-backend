import ReviewDAO from '../dao/review.dao.js'

class ReviewService {
    static async getAllReviews() {
        return await ReviewDAO.getAllReviews()
    }

    static async getReviewById(id) {
        return await ReviewDAO.getReviewById(id)
    }

    static async getReviewsByLodgingId(lodgingId) {
        return await ReviewDAO.getReviewsByLodgingId(lodgingId)
    }

    static async createReview(reviewData) {
        return await ReviewDAO.createReview(reviewData)
    }

    static async deleteReview(id) {
        return await ReviewDAO.deleteReview(id)
    }
}

export default ReviewService
