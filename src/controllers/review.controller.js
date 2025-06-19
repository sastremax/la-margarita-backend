import reviewService from '../services/review.service.js'

export async function createReview(req, res, next) {
    try {
        const review = await reviewService.createReview(req.body)
        res.status(201).json({ status: 'success', data: review })
    } catch (error) {
        next(error)
    }
}

export async function getReviewsByLodging(req, res, next) {
    try {
        const reviews = await reviewService.getReviewsByLodging(req.params.lodgingId)
        res.status(200).json({ status: 'success', data: reviews })
    } catch (error) {
        next(error)
    }
}

export async function deleteReview(req, res, next) {
    try {
        await reviewService.deleteReview(req.params.id)
        res.status(204).end()
    } catch (error) {
        next(error)
    }
}
