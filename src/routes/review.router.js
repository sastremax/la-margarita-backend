import express from 'express'
import reviewController from '../controllers/review.controller.js'
import authPolicy from '../middlewares/authPolicy.middleware.js'
import validateDTO from '../middlewares/validateDTO.middleware.js'
import reviewDTO from '../dto/review.dto.js'

const router = express.Router()


router.post('/', authPolicy(['user']), validateDTO(reviewDTO.reviewSchema), reviewController.createReview)
router.get('/', authPolicy(['admin']), reviewController.getAllReviews)
router.get('/summary/:lodgingId', reviewController.getReviewSummary)
router.get('/:lodgingId', reviewController.getReviewsByLodging)
router.get('/detail/:id', authPolicy(['admin']), reviewController.getReviewById)
router.get('/replied/:lodgingId', authPolicy(['admin']), reviewController.getRepliedReviewsByLodging)
router.delete('/:id', authPolicy(['user', 'admin']), reviewController.deleteReview)
router.put('/:id/reply', authPolicy(['admin']), reviewController.putAdminReply)

export default router