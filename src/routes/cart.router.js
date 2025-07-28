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
import cartDTO from '../dto/cart.dto.js'
import { validateCartExists } from '../middlewares/validateCartExists.js'
import { verifyOwnership } from '../middlewares/verifyOwnership.js'
import cartService from '../services/cart.service.js'

export const cartRouter = express.Router()

cartRouter.get(
    '/:cid',
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
    authPolicy(['user', 'admin']),
    validateCartExists,
    verifyOwnership(async (req) => {
        const cart = await cartService.getCartById(req.params.cid)
        return cart?.userId
    }),
    validateDTO(cartDTO.cartItemSchema),
    addProductToCart
)

cartRouter.delete(
    '/:cid/product/:pid',
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
    authPolicy(['user', 'admin']),
    validateCartExists,
    verifyOwnership(async (req) => {
        const cart = await cartService.getCartById(req.params.cid)
        return cart?.userId
    }),
    purchaseCart
)
