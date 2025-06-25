import express from 'express'
import cartController from '../controllers/cart.controller.js'
import authPolicy from '../middlewares/authPolicy.middleware.js'
import validateDTO from '../middlewares/validateDTO.middleware.js'
import cartDTO from '../dto/cart.dto.js'

const router = express.Router()

router.get('/:cid', authPolicy(['user', 'admin']), cartController.getCartById)
router.post('/', authPolicy(['user', 'admin']), cartController.createCart)
router.post('/:cid/product/:pid', authPolicy(['user', 'admin']), validateDTO(cartDTO.cartItemSchema), cartController.addProductToCart)
router.delete('/:cid/product/:pid', authPolicy(['user', 'admin']), cartController.removeProductFromCart)
router.put('/:cid', authPolicy(['user', 'admin']), cartController.updateCartProducts)
router.put('/:cid/product/:pid', authPolicy(['user', 'admin']), cartController.updateProductQuantity)
router.delete('/:cid', authPolicy(['user', 'admin']), cartController.deleteCart)
router.post('/:cid/purchase', authPolicy(['user', 'admin']), cartController.purchaseCart)

export default router