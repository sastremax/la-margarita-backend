import express from 'express'
import * as reviewController from '../controllers/review.controller.js'
import { passportWithPolicy } from '../middlewares/authPolicy.middleware.js'
import validateDTO from '../middlewares/validateDTO.middleware.js'
import { reviewSchema } from '../dto/review.dto.js'

const router = express.Router()

router.post('/', passportWithPolicy(['user']), validateDTO(reviewSchema), reviewController.postReview)
router.get('/summary/:lodgingId', reviewController.getReviewSummary)
router.get('/:lodgingId', reviewController.getReviewsByLodging)
router.delete('/:id', passportWithPolicy(['user', 'admin']), reviewController.deleteReview)
router.put('/:id/reply', passportWithPolicy(['admin']), reviewController.putAdminReply)

export default router