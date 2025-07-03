import ReviewModel from '../models/review.model.js'

class ReviewDAO {
    async getAllReviews({ page = 1, limit = 10 }) {
        const skip = (page - 1) * limit

        const [total, data] = await Promise.all([
            ReviewModel.countDocuments(),
            ReviewModel.find()
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

    async getReviewsByLodgingId(lodgingId) {
        return await ReviewModel.find({ lodging: lodgingId })
    }

    async createReview(reviewData) {
        return await ReviewModel.create(reviewData)
    }

    async getReviewsWithReplyByLodging(lodgingId) {
        return await ReviewModel.find({
            lodging: lodgingId,
            'adminReply.message': { $exists: true, $ne: null }
        })
    }

}

export default ReviewDAO
