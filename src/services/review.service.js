import ReviewModel from '../models/review.model.js'
import LodgingModel from '../models/lodging.model.js'

const createReview = async ({ userId, lodgingId, rating, comment }) => {
    const lodging = await LodgingModel.findById(lodgingId)
    if (!lodging) throw new Error('Lodging not found')

    const review = await ReviewModel.create({
        user: userId,
        lodging: lodgingId,
        rating,
        comment
    })

    return review
}

const getReviewsByLodging = async (lodgingId) => {
    return await ReviewModel.find({ lodging: lodgingId }).populate('user')
}

const deleteReview = async (reviewId) => {
    const deleted = await ReviewModel.findByIdAndDelete(reviewId)
    if (!deleted) throw new Error('Review not found or delete failed')
    return deleted
}

export default {
    createReview,
    getReviewsByLodging,
    deleteReview
}
