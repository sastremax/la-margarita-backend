import ReviewModel from '../models/review.model.js'

class ReviewDAO {
    async getAllReviews() {
        return await ReviewModel.find()
    }

    async getReviewById(id) {
        return await ReviewModel.findById(id)
    }

    async getReviewsByLodging(lodgingId, filters = {}, pagination = {}) {
        const query = { lodging: lodgingId }

        if (filters.hasReply) {
            query['adminReply.message'] = { $ne: null }
        }

        if (filters.minRating) {
            query.rating = { $gte: filters.minRating }
        }

        const { page = 1, limit = 10 } = pagination
        const skip = (page - 1) * limit

        const [total, reviews] = await Promise.all([
            ReviewModel.countDocuments(query),
            ReviewModel.find(query)
                .populate('user', 'firstName lastName country')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
        ])

        return { total, page, limit, reviews }
    }

    async createReview(data) {
        return await ReviewModel.create(data)
    }

    async deleteReview(id) {
        return await ReviewModel.findByIdAndDelete(id)
    }

    async replyToReview(id, replyMessage) {
        return await ReviewModel.findByIdAndUpdate(
            id,
            { adminReply: { message: replyMessage, createdAt: new Date() } },
            { new: true }
        )
    }
}

export default ReviewDAO