import { reviewReplySchema } from '../dto/reviewReply.dto.js'
import { reviewService } from '../services/review.service.js'

export const getAllReviews = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const result = await reviewService.getAllReviews({ page, limit })
        res.status(200).json({ status: 'success', total: result.total, page: result.page, pages: result.pages, data: result.data })
    } catch (error) {
        next(error)
    }
}

export const getReviewsByLodging = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, hasReply, minRating } = req.query
        const numericPage = parseInt(page, 10)
        const numericLimit = parseInt(limit, 10)
        const numericMinRating = minRating ? parseFloat(minRating) : null
        const filters = { hasReply: hasReply === 'true', minRating: numericMinRating }
        const result = await reviewService.getReviewsByLodgingId(req.params.lodgingId, { page: numericPage, limit: numericLimit, filters })
        res.status(200).json({ status: 'success', data: result })
    } catch (error) {
        next(error)
    }
}

export const createReview = async (req, res, next) => {
    try {
        const review = await reviewService.createReview(req.body)
        res.status(201).json({ status: 'success', data: review })
    } catch (error) {
        next(error)
    }
}

export const getReviewSummary = async (req, res, next) => {
    try {
        const { lodgingId } = req.params
        const summary = await reviewService.getReviewSummary(lodgingId)
        res.status(200).json({ status: 'success', data: summary })
    } catch (error) {
        next(error)
    }
}

export const deleteReview = async (req, res, next) => {
    try {
        const reviewId = req.params.rid
        await reviewService.deleteReview(reviewId)
        res.status(200).json({ status: 'success', message: 'Review deleted' })
    } catch (error) {
        next(error)
    }
}

export const putAdminReply = async (req, res, next) => {
    try {
        const { id } = req.params
        const parsed = reviewReplySchema.parse(req.body)
        const updatedReview = await reviewService.replyToReview(id, parsed.message)
        res.status(200).json({ status: 'success', data: updatedReview })
    } catch (error) {
        next(error)
    }
}

export const getReviewById = async (req, res, next) => {
    try {
        const reviewId = req.params.rid
        const review = await reviewService.getReviewById(reviewId)
        if (!review) {
            return res.status(404).json({ status: 'error', message: 'Review not found' })
        }
        res.status(200).json({ status: 'success', data: review })
    } catch (error) {
        next(error)
    }
}

export const getRepliedReviewsByLodging = async (req, res, next) => {
    try {
        const { lodgingId } = req.params
        const reviews = await reviewService.getRepliedReviewsByLodging(lodgingId)
        res.status(200).json({ status: 'success', data: reviews })
    } catch (error) {
        next(error)
    }
}

export const updateReview = async (req, res, next) => {
    try {
        const reviewId = req.params.rid
        const userId = req.user.id
        const updateData = req.body
        const updatedReview = await reviewService.updateReview(reviewId, userId, updateData)
        res.status(200).json({ status: 'success', data: updatedReview })
    } catch (error) {
        next(error)
    }
}
