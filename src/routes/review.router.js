import express from 'express'
import { param } from 'express-validator'

import { createReview, deleteReview, getAllReviews, getReviewById, updateReview } from '../controllers/review.controller.js'
import { reviewDTO } from '../dto/review.dto.js'
import { authPolicy } from '../middlewares/authPolicy.middleware.js'
import { validateReviewExists } from '../middlewares/exists/validateReviewExists.js'
import { validateDTO } from '../middlewares/validateDTO.middleware.js'
import { validateRequest } from '../middlewares/validateRequest.middleware.js'
import { ApiError } from '../utils/apiError.js'

const router = express.Router()

const ensureOwnerOrAdmin = (req, res, next) => {
    if (req.user?.role === 'admin') return next()
    const ownerId = req.review?.user?.id || req.review?.userId || null
    if (req.user?.id && ownerId && req.user.id === ownerId) return next()
    next(new ApiError(403, 'Access denied'))
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
