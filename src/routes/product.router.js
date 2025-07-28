import express from 'express'
import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
} from '../controllers/product.controller.js'
import { authPolicy } from '../middlewares/authPolicy.middleware.js'
import { validateDTO } from '../middlewares/validateDTO.middleware.js'
import productDTO from '../dto/product.dto.js'

export const productRouter = express.Router()

productRouter.get('/', getAllProducts)
productRouter.get('/:pid', getProductById)
productRouter.post('/', authPolicy(['admin']), validateDTO(productDTO.productSchema), createProduct)
productRouter.put('/:pid', authPolicy(['admin']), validateDTO(productDTO.productSchema), updateProduct)
productRouter.delete('/:pid', authPolicy(['admin']), deleteProduct)
