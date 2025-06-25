import express from 'express'
import cartController from '../controllers/cart.controller.js'
import { passportWithPolicy } from '../middlewares/authPolicy.middleware.js'
import validateDTO from '../middlewares/validateDTO.middleware.js'
import cartDTO from '../dto/cart.dto.js'

const router = express.Router()

router.get('/:cid', passportWithPolicy(['user', 'admin']), cartController.getCartById)
router.post('/', passportWithPolicy(['user', 'admin']), cartController.createCart)
router.post('/:cid/product/:pid', passportWithPolicy(['user', 'admin']), validateDTO(cartDTO.cartItemSchema), cartController.addProductToCart)
router.delete('/:cid/product/:pid', passportWithPolicy(['user', 'admin']), cartController.removeProductFromCart)
router.put('/:cid', passportWithPolicy(['user', 'admin']), cartController.updateCartProducts)
router.put('/:cid/product/:pid', passportWithPolicy(['user', 'admin']), cartController.updateProductQuantity)
router.delete('/:cid', passportWithPolicy(['user', 'admin']), cartController.deleteCart)
router.post('/:cid/purchase', passportWithPolicy(['user', 'admin']), cartController.purchaseCart)

export default router
