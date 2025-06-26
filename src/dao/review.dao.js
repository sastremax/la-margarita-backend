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

    async getReviewsWithReplyByLodging(lodgingId) {
        return await ReviewModel.find({
            lodging: lodgingId,
            'adminReply.message': { $exists: true, $ne: null }
        })
    }

    async getAverageRatingByLodging(lodgingId) {
        const result = await ReviewModel.aggregate([
            { $match: { lodging: new mongoose.Types.ObjectId(lodgingId) } },
            { $group: { _id: null, avgRating: { $avg: '$rating' } } }
        ])

        return result[0]?.avgRating || 0
    }

}

export default ReviewDAO
