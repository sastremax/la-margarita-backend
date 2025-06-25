import express from 'express'
import * as productController from '../controllers/product.controller.js'

const router = express.Router()

router.get('/', productController.getAllProducts)
router.get('/:pid', productController.getProductById)
router.post('/', productController.createProduct)
router.put('/:pid', productController.updateProduct)
router.delete('/:pid', productController.deleteProduct)

export default router
