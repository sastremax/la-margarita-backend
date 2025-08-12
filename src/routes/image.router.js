import express from 'express'
import { param } from 'express-validator'

import { deleteImage, getAllImages, getImageById, getImagesByLodgingId, uploadImage } from '../controllers/image.controller.js'
import { imageSchema } from '../dto/image.dto.js'
import { authPolicy } from '../middlewares/authPolicy.middleware.js'
import { validateDTO } from '../middlewares/validateDTO.middleware.js'
import { validateRequest } from '../middlewares/validateRequest.middleware.js'

export const imageRouter = express.Router()

imageRouter.post('/', authPolicy(['admin']), validateDTO(imageSchema), uploadImage)

imageRouter.get('/', authPolicy(['admin']), getAllImages)

imageRouter.get(
    '/lodging/:lodgingId',
    param('lodgingId').isMongoId().withMessage('Invalid lodging ID'),
    validateRequest,
    authPolicy(['admin']),
    getImagesByLodgingId
)

imageRouter.get(
    '/:id',
    param('id').isMongoId().withMessage('Invalid image ID'),
    validateRequest,
    authPolicy(['admin']),
    getImageById
)

imageRouter.delete(
    '/:id',
    param('id').isMongoId().withMessage('Invalid image ID'),
    validateRequest,
    authPolicy(['admin']),
    deleteImage
)
