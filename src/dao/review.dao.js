import ReviewModel from '../models/review.model.js'

class ReviewDAO {
    async getAllReviews() {
        return await ReviewModel.find()
    }

    async getReviewById(id) {
        return await ReviewModel.findById(id)
    }

    async getReviewsByLodgingId(lodgingId) {
        return await ReviewModel.find({ lodging: lodgingId })
    }

    async createReview(reviewData) {
        return await ReviewModel.create(reviewData)
    }

    async deleteReview(id) {
        return await ReviewModel.findByIdAndDelete(id)
    }
}

export default ReviewDAO
