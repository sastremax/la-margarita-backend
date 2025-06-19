import { Router } from 'express';
import {
    postReview,
    getReviewsByLodging,
    deleteReview,
    putAdminReply
} from '../controllers/review.controller.js';
import { passportWithPolicy } from '../middlewares/authPolicy.middleware.js';

const router = Router();

router.post('/', passportWithPolicy(['user']), postReview);
router.get('/:lodgingId', getReviewsByLodging);
router.delete('/:id', passportWithPolicy(['user', 'admin']), deleteReview);
router.put('/:id/reply', passportWithPolicy(['admin']), putAdminReply);

export default router;
