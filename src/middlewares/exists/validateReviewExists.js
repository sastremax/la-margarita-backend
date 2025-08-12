import { reviewService } from '../../services/review.service.js'
import { ApiError } from '../../utils/apiError.js'

export const validateReviewExists = async (req, res, next) => {
    try {
        const id = req.params?.rid || req.params?.id
        if (!id) {
            return next(new ApiError(400, 'Missing review ID'))
        }
        const review = await reviewService.getReviewById(id)
        if (!review) throw new ApiError(404, 'Review not found')
        req.review = review
        next()
    } catch (error) {
        next(error)
    }
}
