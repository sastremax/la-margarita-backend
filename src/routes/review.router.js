import express from 'express'
import reviewController from '../controllers/review.controller.js'
import { passportWithPolicy } from '../middlewares/authPolicy.middleware.js'
import validateDTO from '../middlewares/validateDTO.middleware.js'
import { reviewSchema } from '../dto/review.dto.js'
import reviewReplySchema from '../dto/reviewReply.dto.js'

const router = express.Router()

router.post('/', passportWithPolicy(['user']), validateDTO(reviewSchema), reviewController.createReview)
router.get('/summary/:lodgingId', reviewController.getReviewSummary)
router.get('/:lodgingId', reviewController.getReviewsByLodging)
router.delete('/:id', passportWithPolicy(['user', 'admin']), reviewController.deleteReview)
router.patch('/:id/reply', passportWithPolicy(['admin']), validateDTO(reviewReplySchema), reviewController.replyToReview)

export default router