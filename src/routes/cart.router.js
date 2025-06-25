import express from 'express'
import * as cartController from '../controllers/cart.controller.js'

const router = express.Router()

router.get('/:cid', cartController.getCartById)
router.post('/', cartController.createCart)
router.post('/:cid/product/:pid', cartController.addProductToCart)
router.delete('/:cid/product/:pid', cartController.removeProductFromCart)
router.put('/:cid', cartController.updateCartProducts)
router.put('/:cid/product/:pid', cartController.updateProductQuantity)
router.delete('/:cid', cartController.clearCart)
router.post('/:cid/purchase', cartController.purchaseCart)

export default router
