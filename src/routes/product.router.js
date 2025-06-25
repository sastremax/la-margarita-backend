import express from 'express'
import * as productController from '../controllers/product.controller.js'
import { passportWithPolicy } from '../middlewares/authPolicy.middleware.js'
import validateDTO from '../middlewares/validateDTO.middleware.js'
import { productSchema } from '../dto/product.dto.js'

const router = express.Router()

router.get('/', productController.getAllProducts)
router.get('/:pid', productController.getProductById)
router.post('/', passportWithPolicy(['admin']), validateDTO(productSchema), productController.createProduct)
router.put('/:pid', passportWithPolicy(['admin']), validateDTO(productSchema), productController.updateProduct)
router.delete('/:pid', passportWithPolicy(['admin']), productController.deleteProduct)

export default router
