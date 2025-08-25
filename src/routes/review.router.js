import express from 'express'
import { param } from 'express-validator'

import { createReview, deleteReview, getAllReviews, getReviewById, updateReview, replyToReview } from '../controllers/review.controller.js'
import { reviewDTO } from '../dto/review.dto.js'
import { reviewReplySchema } from '../dto/reviewReply.dto.js'
import { authPolicy } from '../middlewares/authPolicy.middleware.js'
import { validateReviewExists } from '../middlewares/exists/validateReviewExists.js'
import { validateDTO } from '../middlewares/validateDTO.middleware.js'
import { validateRequest } from '../middlewares/validateRequest.middleware.js'

const router = express.Router()

const ensureOwnerOrAdmin = (req, res, next) => {
    if (req.user?.role === 'admin') return next()
    const ownerId = String(
        req.review?.user?._id ||
        req.review?.user?.id ||
        req.review?.user ||
        ''
    )
    const currentUserId = String(req.user?.id || '')
    if (!currentUserId) return res.status(401).json({ status: 'error', error: 'Unauthorized' })
    if (!ownerId || ownerId !== currentUserId) return res.status(403).json({ status: 'error', error: 'Forbidden' })
    return next()
}

router.get(
    '/',
    authPolicy(['admin']),
    validateDTO(reviewDTO.reviewQuerySchema, 'query'),
    getAllReviews
)

router.get(
    '/:id',
    param('id').isMongoId().withMessage('Invalid review ID'),
    validateRequest,
    authPolicy(['user', 'admin']),
    validateReviewExists,
    ensureOwnerOrAdmin,
    getReviewById
)

router.post(
    '/',
    authPolicy(['user']),
    validateDTO(reviewDTO.reviewSchema),
    createReview
)

router.put(
    '/:id',
    param('id').isMongoId().withMessage('Invalid review ID'),
    validateRequest,
    authPolicy(['user', 'admin']),
    validateReviewExists,
    ensureOwnerOrAdmin,
    validateDTO(reviewDTO.reviewUpdateSchema),
    updateReview
)

router.put(
    '/:id/reply',
    param('id').isMongoId().withMessage('Invalid review ID'),
    validateRequest,
    authPolicy(['admin']),
    validateDTO(reviewReplySchema),
    replyToReview
)

router.delete(
    '/:id',
    param('id').isMongoId().withMessage('Invalid review ID'),
    validateRequest,
    authPolicy(['user', 'admin']),
    validateReviewExists,
    ensureOwnerOrAdmin,
    deleteReview
)

export const reviewRouter = router
