import { reviewService } from '../../services/review.service.js'
import { ApiError } from '../../utils/apiError.js'

export const validateReviewExists = async (req, res, next) => {
    try {
        if (!req.params?.rid) {
            return next(new ApiError(400, 'Missing review ID'))
        }

        const review = await reviewService.getReviewById(req.params.rid)
        if (!review) throw new ApiError(404, 'Review not found')

        next()
    } catch (error) {
        next(error)
    }
}
