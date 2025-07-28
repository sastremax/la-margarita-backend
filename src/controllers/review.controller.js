import reviewService from '../services/review.service.js'
import reviewDTO from '../dto/review.dto.js'
import factory from '../dao/factory.js'

const ReviewDAO = factory.reviewDAO

const getAllReviews = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10

        const result = await reviewService.getAllReviews({ page, limit })

        res.status(200).json({
            status: 'success',
            total: result.total,
            page: result.page,
            pages: result.pages,
            data: result.data
        })
    } catch (error) {
        next(error)
    }
}

const getReviewsByLodging = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, hasReply, minRating } = req.query

        const numericPage = parseInt(page, 10)
        const numericLimit = parseInt(limit, 10)
        const numericMinRating = minRating ? parseFloat(minRating) : null

        const filters = {
            hasReply: hasReply === 'true',
            minRating: numericMinRating
        }

        const result = await reviewService.getReviewsByLodging(req.params.lodgingId, {
            page: numericPage,
            limit: numericLimit,
            filters
        })

        const publicData = {
            ...result,
            reviews: result.reviews.map(reviewDTO.asPublicReview)
        }

        res.status(200).json({ status: 'success', data: publicData })
    } catch (error) {
        next(error)
    }
}

const createReview = async (req, res, next) => {
    try {
        const review = await reviewService.createReview(req.body)
        res.status(201).json({ status: 'success', data: reviewDTO.asPublicReview(review) })
    } catch (error) {
        next(error)
    }
}

const getReviewSummary = async (req, res, next) => {
    try {
        const { lodgingId } = req.params
        const summary = await reviewService.getReviewSummary(lodgingId)
        res.status(200).json({ status: 'success', data: summary })
    } catch (error) {
        next(error)
    }
}

const deleteReview = async (req, res, next) => {
    try {
        const reviewId = req.params.id
        const userId = req.user._id
        await reviewService.deleteReview(reviewId, userId)
        res.status(200).json({ status: 'success', message: 'Review deleted' })
    } catch (error) {
        next(error)
    }
}

const putAdminReply = async (req, res, next) => {
    try {
        const reviewId = req.params.id
        const { message } = req.body

        const updatedReview = await reviewService.replyToReview(reviewId, message)

        res.status(200).json({ status: 'success', data: reviewDTO.asPublicReview(updatedReview) })
    } catch (error) {
        next(error)
    }
}

const getReviewById = async (req, res, next) => {
    try {
        const reviewId = req.params.id
        const review = await reviewService.getReviewById(reviewId)

        if (!review) {
            return res.status(404).json({ status: 'error', message: 'Review not found' })
        }

        res.status(200).json({ status: 'success', data: review })
    } catch (error) {
        next(error)
    }
}

const getRepliedReviewsByLodging = async (req, res, next) => {
    try {
        const { lodgingId } = req.params
        const reviews = await ReviewDAO.getReviewsWithReplyByLodging(lodgingId)

        res.status(200).json({
            status: 'success',
            data: reviews
        })
    } catch (error) {
        next(error)
    }
}

export default {
    getRepliedReviewsByLodging,
    getReviewById,
    getAllReviews,
    getReviewsByLodging,
    createReview,
    getReviewSummary,
    deleteReview,
    putAdminReply
}