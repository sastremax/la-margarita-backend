import express from 'express'
import * as imageController from '../controllers/image.controller.js'
import { passportWithPolicy } from '../middlewares/authPolicy.middleware.js'
import validateDTO from '../middlewares/validateDTO.middleware.js'
import { imageSchema } from '../dto/image.dto.js'

const router = express.Router()

router.post('/', passportWithPolicy(['admin']), validateDTO(imageSchema), imageController.uploadImage)
router.delete('/:iid', passportWithPolicy(['admin']), imageController.deleteImage)

export default router
