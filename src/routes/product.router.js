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

export const productRouter = express.Router()

productRouter.get('/', getAllProducts)
productRouter.get('/:pid', getProductById)
productRouter.post('/', authPolicy(['admin']), validateDTO(productSchema), createProduct)
productRouter.put('/:pid', authPolicy(['admin']), validateDTO(productSchema), updateProduct)
productRouter.delete('/:pid', authPolicy(['admin']), deleteProduct)
