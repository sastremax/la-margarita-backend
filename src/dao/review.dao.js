import ReviewModel from '../models/review.model.js'

class ReviewDAO {
    static async getAllReviews() {
        return await ReviewModel.find()
    }

    static async getReviewById(id) {
        return await ReviewModel.findById(id)
    }

    static async getReviewsByLodgingId(lodgingId) {
        return await ReviewModel.find({ lodging: lodgingId })
    }

    static async createReview(reviewData) {
        return await ReviewModel.create(reviewData)
    }

    static async deleteReview(id) {
        return await ReviewModel.findByIdAndDelete(id)
    }
}

export default ReviewDAO
