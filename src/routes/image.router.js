import express from 'express';
import * as imageController from '../controllers/image.controller.js';
import { passportWithPolicy } from '../middlewares/authPolicy.middleware.js';

const router = express.Router();

router.post('/', passportWithPolicy(['admin']), imageController.uploadImage);
router.delete('/:iid', passportWithPolicy(['admin']), imageController.deleteImage);

export default router;
