import express from 'express'

import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    updateProduct
} from '../controllers/product.controller.js'

import { authPolicy } from '../middlewares/authPolicy.middleware.js'
import { validateDTO } from '../middlewares/validateDTO.middleware.js'
import { productSchema } from '../dto/product.dto.js'
import { param } from 'express-validator'
import { validateRequest } from '../middlewares/validateRequest.middleware.js'

export const productRouter = express.Router()

productRouter.get('/', getAllProducts)

productRouter.get(
    '/:pid',
    param('pid').isMongoId().withMessage('Invalid product ID'),
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
    '/:pid',
    param('pid').isMongoId().withMessage('Invalid product ID'),
    validateRequest,
    authPolicy(['admin']),
    validateDTO(productSchema),
    updateProduct
)

productRouter.delete(
    '/:pid',
    param('pid').isMongoId().withMessage('Invalid product ID'),
    validateRequest,
    authPolicy(['admin']),
    deleteProduct
)
