import * as reviewService from '../services/review.service.js'
import * as reviewService from '../services/review.service.js'

export async function postReview(req, res, next) {
    try {
        const data = { ...req.body, user: req.user._id }
        const review = await reviewService.createReview(data)
        res.status(201).json({ status: 'success', data: review })
        const data = { ...req.body, user: req.user._id }
        const review = await reviewService.createReview(data)
        res.status(201).json({ status: 'success', data: review })
    } catch (error) {
        next(error)
        next(error)
    }
}

export async function getReviewsByLodging(req, res, next) {
    try {
        const { page = 1, limit = 10 } = req.query
        const numericPage = parseInt(page, 10)
        const numericLimit = parseInt(limit, 10)

        const result = await reviewService.getReviewsByLodging(req.params.lodgingId, {
            page: numericPage,
            limit: numericLimit
        })

        res.status(200).json({ status: 'success', data: result })
        const reviews = await reviewService.getReviewsByLodging(req.params.lodgingId)
        res.status(200).json({ status: 'success', data: reviews })
    } catch (error) {
        next(error)
        next(error)
    }
}

export async function deleteReview(req, res, next) {
    try {
        const reviewId = req.params.id
        const userId = req.user._id
        const isAdmin = req.user.role === 'admin'
        await reviewService.deleteReview(reviewId, userId, isAdmin)
        res.status(204).end()
        const reviewId = req.params.id
        const userId = req.user._id
        const isAdmin = req.user.role === 'admin'
        await reviewService.deleteReview(reviewId, userId, isAdmin)
        res.status(204).end()
    } catch (error) {
        next(error)
        next(error)
    }
}

export async function putAdminReply(req, res, next) {
    try {
        const reviewId = req.params.id
        const { message } = req.body
        const review = await reviewService.addAdminReply(reviewId, message)
        res.status(200).json({ status: 'success', data: review })
        const reviewId = req.params.id
        const { message } = req.body
        const review = await reviewService.addAdminReply(reviewId, message)
        res.status(200).json({ status: 'success', data: review })
    } catch (error) {
        next(error)
        next(error)
    }
}

export async function getReviewSummary(req, res, next) {
    try {
        const summary = await reviewService.getLodgingReviewSummary(req.params.lodgingId)
        if (!summary) {
            return res.status(404).json({ status: 'error', message: 'No reviews found' })
        }
        res.status(200).json({ status: 'success', data: summary })
    } catch (error) {
        next(error)
    }
}
export async function getReviewSummary(req, res, next) {
    try {
        const summary = await reviewService.getLodgingReviewSummary(req.params.lodgingId)
        if (!summary) {
            return res.status(404).json({ status: 'error', message: 'No reviews found' })
        }
        res.status(200).json({ status: 'success', data: summary })
    } catch (error) {
        next(error)
    }
}