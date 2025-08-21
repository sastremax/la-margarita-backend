import { reviewReplySchema } from '../dto/reviewReply.dto.js'
import { reviewService } from '../services/review.service.js'

export const getAllReviews = async (req, res, next) => {
    try {
        const page = Number.parseInt(req.query.page) || 1
        const limit = Number.parseInt(req.query.limit) || 10
        const lodgingId = req.query.lodgingId
        if (lodgingId) {
            const filters = {}
            if (typeof req.query.hasReply !== 'undefined') {
                const v = String(req.query.hasReply).toLowerCase()
                filters.hasReply = v === 'true' || v === '1'
            }
            if (typeof req.query.minRating !== 'undefined') {
                const n = Number.parseInt(req.query.minRating)
                if (!Number.isNaN(n)) filters.minRating = n
            }
            const result = await reviewService.getReviewsByLodgingId(lodgingId, { page, limit, filters })
            const data = result.reviews || result.data || []
            res.status(200).json({ status: 'success', total: result.total ?? data.length, page, pages: result.pages ?? 1, data })
            return
        }
        const result = await reviewService.getAllReviews({ page, limit })
        res.status(200).json({ status: 'success', total: result.total, page: result.page, pages: result.pages, data: result.data })
    } catch (error) {
        next(error)
    }
}

export const getReviewById = async (req, res, next) => {
    try {
        const reviewId = req.params.rid || req.params.id
        const review = await reviewService.getReviewById(reviewId)
        if (!review) {
            res.status(404).json({ status: 'error', error: 'Review not found' })
            return
        }
        res.status(200).json({ status: 'success', data: review })
    } catch (error) {
        next(error)
    }
}

export const createReview = async (req, res, next) => {
    try {
        const created = await reviewService.createReview(req.body)
        res.status(201).json({ status: 'success', data: created })
    } catch (error) {
        next(error)
    }
}

export const updateReview = async (req, res, next) => {
    try {
        const reviewId = req.params.rid || req.params.id
        const userId = req.user?.id
        const updateData = req.body
        const updatedReview = await reviewService.updateReview(reviewId, userId, updateData)
        res.status(200).json({ status: 'success', data: updatedReview })
    } catch (error) {
        next(error)
    }
}

export const deleteReview = async (req, res, next) => {
    try {
        const reviewId = req.params.rid || req.params.id
        const result = await reviewService.deleteReview(reviewId)
        res.status(200).json({ status: 'success', data: result })
    } catch (error) {
        next(error)
    }
}

export const replyToReview = async (req, res, next) => {
    try {
        const reviewId = req.params.rid || req.params.id
        const parsed = reviewReplySchema.parse(req.body || {})
        const replied = await reviewService.replyToReview(reviewId, parsed.message)
        res.status(201).json({ status: 'success', data: replied })
    } catch (error) {
        next(error)
    }
}
