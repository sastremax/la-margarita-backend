import reviewService from '../services/review.service.js'
import ApiError from '../utils/apiError.js'

const validateReviewExists = async (req, res, next) => {
    try {
        const review = await reviewService.getReviewById(req.params.rid)
        if (!review) throw new ApiError(404, 'Review not found')
        next()
    } catch (error) {
        next(error)
    }
}

export default validateReviewExists