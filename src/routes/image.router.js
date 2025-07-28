import express from 'express'
import {
    uploadImage,
    getAllImages,
    getImageById,
    getImagesByLodgingId,
    deleteImage
} from '../controllers/image.controller.js'
import { imageSchema } from '../dto/image.dto.js'
import { authPolicy } from '../middlewares/authPolicy.middleware.js'
import { validateDTO } from '../middlewares/validateDTO.middleware.js'

export const imageRouter = express.Router()

imageRouter.post(
    '/',
    authPolicy(['admin']),
    validateDTO(imageSchema),
    uploadImage
)

imageRouter.get('/', authPolicy(['admin']), getAllImages)

imageRouter.get('/:id', authPolicy(['admin']), getImageById)

imageRouter.get('/lodging/:lodgingId', authPolicy(['admin']), getImagesByLodgingId)

imageRouter.delete('/:id', authPolicy(['admin']), deleteImage)
