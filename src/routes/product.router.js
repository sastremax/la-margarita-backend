import express from 'express'
import { param } from 'express-validator'

import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    updateProduct
} from '../controllers/product.controller.js'
import { productSchema } from '../dto/product.dto.js'
import { authPolicy } from '../middlewares/authPolicy.middleware.js'
import { validateDTO } from '../middlewares/validateDTO.middleware.js'
import { validateRequest } from '../middlewares/validateRequest.middleware.js'

export const productRouter = express.Router()

productRouter.get('/', getAllProducts)

productRouter.get(
    '/:id',
    param('id').isMongoId().withMessage('Invalid product ID'),
    validateRequest,
    getProductById
)

productRouter.post(
    '/',
    authPolicy(['admin']),
    validateDTO(productSchema),
    createProduct
)

productRouter.put(
    '/:id',
    param('id').isMongoId().withMessage('Invalid product ID'),
    validateRequest,
    authPolicy(['admin']),
    validateDTO(productSchema.partial()),
    updateProduct
)

productRouter.delete(
    '/:id',
    param('id').isMongoId().withMessage('Invalid product ID'),
    validateRequest,
    authPolicy(['admin']),
    deleteProduct
)
