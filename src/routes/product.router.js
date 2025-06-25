import express from 'express'
import productController from '../controllers/product.controller.js'
import authPolicy from '../middlewares/authPolicy.middleware.js'
import validateDTO from '../middlewares/validateDTO.middleware.js'
import productDTO from '../dto/product.dto.js'

const router = express.Router()

router.get('/', productController.getAllProducts)
router.get('/:pid', productController.getProductById)
router.post('/', authPolicy(['admin']), validateDTO(productDTO.productSchema), productController.createProduct)
router.put('/:pid', authPolicy(['admin']), validateDTO(productDTO.productSchema), productController.updateProduct)
router.delete('/:pid', authPolicy(['admin']), productController.deleteProduct)

export default router