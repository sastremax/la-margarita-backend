import express from 'express'
import * as reviewController from '../controllers/review.controller.js'

const router = express.Router()

router.post('/', reviewController.createReview)
router.get('/lodging/:lid', reviewController.getReviewsByLodging)
router.delete('/:rid', reviewController.deleteReview)

export default router
