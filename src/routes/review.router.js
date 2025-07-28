import express from 'express'
import * as reviewController from '../controllers/review.controller.js'
import { authPolicy } from '../middlewares/authPolicy.middleware.js'
import { validateDTO } from '../middlewares/validateDTO.middleware.js'
import { reviewDTO } from '../dto/review.dto.js'
import { validateReviewExists } from '../middlewares/exists/validateReviewExists.js'
import { verifyOwnership } from '../middlewares/verifyOwnership.js'
import { reviewService } from '../services/review.service.js'

const router = express.Router()

router.get(
    '/',
    authPolicy(['admin']),
    validateDTO(reviewDTO.reviewQuerySchema, 'query'),
    reviewController.getAllReviews
)

router.get(
    '/:rid',
    authPolicy(['user', 'admin']),
    validateReviewExists,
    verifyOwnership(async (req) => {
        const review = await reviewService.getReviewById(req.params.rid)
        return review?.userId
    }),
    reviewController.getReviewById
)

router.post(
    '/',
    authPolicy(['user']),
    validateDTO(reviewDTO.reviewSchema),
    reviewController.createReview
)

router.put(
    '/:rid',
    authPolicy(['user']),
    validateReviewExists,
    verifyOwnership(async (req) => {
        const review = await reviewService.getReviewById(req.params.rid)
        return review?.userId
    }),
    validateDTO(reviewDTO.reviewUpdateSchema),
    reviewController.updateReview
)

router.delete(
    '/:rid',
    authPolicy(['user']),
    validateReviewExists,
    verifyOwnership(async (req) => {
        const review = await reviewService.getReviewById(req.params.rid)
        return review?.userId
    }),
    reviewController.deleteReview
)

export const reviewRouter = router
