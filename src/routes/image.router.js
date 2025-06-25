import express from 'express'
import imageController from '../controllers/image.controller.js'
import authPolicy from '../middlewares/authPolicy.middleware.js'
import validateDTO from '../middlewares/validateDTO.middleware.js'
import imageDTO from '../dto/image.dto.js'

const router = express.Router()

router.post('/', authPolicy(['admin']), validateDTO(imageDTO.imageSchema), imageController.uploadImage)
router.delete('/:iid', authPolicy(['admin']), imageController.deleteImage)

export default router