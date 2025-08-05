import express from 'express'
import {
    createCart,
    getCartById,
    addProductToCart,
    deleteCart,
    removeProductFromCart,
    updateCartProducts,
    updateProductQuantity,
    purchaseCart
} from '../controllers/cart.controller.js'
import { authPolicy } from '../middlewares/authPolicy.middleware.js'
import { validateDTO } from '../middlewares/validateDTO.middleware.js'
import { cartItemSchema } from '../dto/cart.dto.js'
import { validateCartExists } from '../middlewares/validateCartExists.js'
import { verifyOwnership } from '../middlewares/verifyOwnership.js'
import { cartService } from '../services/cart.service.js'
import { param } from 'express-validator'
import { validateRequest } from '../middlewares/validateRequest.middleware.js'

export const cartRouter = express.Router()

cartRouter.get(
    '/:cid',
    param('cid').isMongoId().withMessage('Invalid cart ID'),
    validateRequest,
    authPolicy(['user', 'admin']),
    validateCartExists,
    verifyOwnership(async (req) => {
        const cart = await cartService.getCartById(req.params.cid)
        return cart?.userId
    }),
    getCartById
)

cartRouter.post('/', authPolicy(['user', 'admin']), createCart)

cartRouter.post(
    '/:cid/product/:pid',
    param('cid').isMongoId().withMessage('Invalid cart ID'),
    param('pid').isMongoId().withMessage('Invalid product ID'),
    validateRequest,
    authPolicy(['user', 'admin']),
    validateCartExists,
    verifyOwnership(async (req) => {
        const cart = await cartService.getCartById(req.params.cid)
        return cart?.userId
    }),
    validateDTO(cartItemSchema),
    addProductToCart
)

cartRouter.delete(
    '/:cid/product/:pid',
    param('cid').isMongoId().withMessage('Invalid cart ID'),
    param('pid').isMongoId().withMessage('Invalid product ID'),
    validateRequest,
    authPolicy(['user', 'admin']),
    validateCartExists,
    verifyOwnership(async (req) => {
        const cart = await cartService.getCartById(req.params.cid)
        return cart?.userId
    }),
    removeProductFromCart
)

cartRouter.put(
    '/:cid',
    param('cid').isMongoId().withMessage('Invalid cart ID'),
    validateRequest,
    authPolicy(['user', 'admin']),
    validateCartExists,
    verifyOwnership(async (req) => {
        const cart = await cartService.getCartById(req.params.cid)
        return cart?.userId
    }),
    updateCartProducts
)

cartRouter.put(
    '/:cid/product/:pid',
    param('cid').isMongoId().withMessage('Invalid cart ID'),
    param('pid').isMongoId().withMessage('Invalid product ID'),
    validateRequest,
    authPolicy(['user', 'admin']),
    validateCartExists,
    verifyOwnership(async (req) => {
        const cart = await cartService.getCartById(req.params.cid)
        return cart?.userId
    }),
    updateProductQuantity
)

cartRouter.delete(
    '/:cid',
    param('cid').isMongoId().withMessage('Invalid cart ID'),
    validateRequest,
    authPolicy(['user', 'admin']),
    validateCartExists,
    verifyOwnership(async (req) => {
        const cart = await cartService.getCartById(req.params.cid)
        return cart?.userId
    }),
    deleteCart
)

cartRouter.post(
    '/:cid/purchase',
    param('cid').isMongoId().withMessage('Invalid cart ID'),
    validateRequest,
    authPolicy(['user', 'admin']),
    validateCartExists,
    verifyOwnership(async (req) => {
        const cart = await cartService.getCartById(req.params.cid)
        return cart?.userId
    }),
    purchaseCart
)
