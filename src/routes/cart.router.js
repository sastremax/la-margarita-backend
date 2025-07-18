import express from 'express'
import cartController from '../controllers/cart.controller.js'
import authPolicy from '../middlewares/authPolicy.middleware.js'
import validateDTO from '../middlewares/validateDTO.middleware.js'
import cartDTO from '../dto/cart.dto.js'
import validateCartExists from '../middlewares/validateCartExists.js'
import verifyOwnership from '../middlewares/verifyOwnership.js'
import cartService from '../services/cart.service.js'

const router = express.Router()

router.get(
    '/:cid',
    authPolicy(['user', 'admin']),
    validateCartExists,
    verifyOwnership(async (req) => {
        const cart = await cartService.getCartById(req.params.cid)
        return cart?.userId
    }),
    cartController.getCartById
)

router.post('/', authPolicy(['user', 'admin']), cartController.createCart)

router.post(
    '/:cid/product/:pid',
    authPolicy(['user', 'admin']),
    validateCartExists,
    verifyOwnership(async (req) => {
        const cart = await cartService.getCartById(req.params.cid)
        return cart?.userId
    }),
    validateDTO(cartDTO.cartItemSchema),
    cartController.addProductToCart
)

router.delete(
    '/:cid/product/:pid',
    authPolicy(['user', 'admin']),
    validateCartExists,
    verifyOwnership(async (req) => {
        const cart = await cartService.getCartById(req.params.cid)
        return cart?.userId
    }),
    cartController.removeProductFromCart
)

router.put(
    '/:cid',
    authPolicy(['user', 'admin']),
    validateCartExists,
    verifyOwnership(async (req) => {
        const cart = await cartService.getCartById(req.params.cid)
        return cart?.userId
    }),
    cartController.updateCartProducts
)

router.put(
    '/:cid/product/:pid',
    authPolicy(['user', 'admin']),
    validateCartExists,
    verifyOwnership(async (req) => {
        const cart = await cartService.getCartById(req.params.cid)
        return cart?.userId
    }),
    cartController.updateProductQuantity
)

router.delete(
    '/:cid',
    authPolicy(['user', 'admin']),
    validateCartExists,
    verifyOwnership(async (req) => {
        const cart = await cartService.getCartById(req.params.cid)
        return cart?.userId
    }),
    cartController.deleteCart
)

router.post(
    '/:cid/purchase',
    authPolicy(['user', 'admin']),
    validateCartExists,
    verifyOwnership(async (req) => {
        const cart = await cartService.getCartById(req.params.cid)
        return cart?.userId
    }),
    cartController.purchaseCart
)

export default router