import express from 'express'
import { param } from 'express-validator'

import {
    addProductToCart,
    createCart,
    deleteCart,
    getCartById,
    purchaseCart,
    removeProductFromCart,
    updateCartProducts,
    updateProductQuantity
} from '../controllers/cart.controller.js'
import { cartItemSchema } from '../dto/cart.dto.js'
import { authPolicy } from '../middlewares/authPolicy.middleware.js'
import { validateCartExists } from '../middlewares/validateCartExists.js'
import { validateDTO } from '../middlewares/validateDTO.middleware.js'
import { validateRequest } from '../middlewares/validateRequest.middleware.js'
import { ApiError } from '../utils/apiError.js'

export const cartRouter = express.Router()

const ensureOwnerOrAdmin = (req, res, next) => {
    if (req.user?.role === 'admin') return next()
    const ownerId = req.cart?.userId
    if (req.user?.id && ownerId && req.user.id === ownerId) return next()
    next(new ApiError(403, 'Access denied'))
}

cartRouter.get(
    '/:id',
    param('id').isMongoId().withMessage('Invalid cart ID'),
    validateRequest,
    authPolicy(['user', 'admin']),
    validateCartExists,
    ensureOwnerOrAdmin,
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
    ensureOwnerOrAdmin,
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
    ensureOwnerOrAdmin,
    removeProductFromCart
)

cartRouter.put(
    '/:cid',
    param('cid').isMongoId().withMessage('Invalid cart ID'),
    validateRequest,
    authPolicy(['user', 'admin']),
    validateCartExists,
    ensureOwnerOrAdmin,
    updateCartProducts
)

cartRouter.put(
    '/:cid/product/:pid',
    param('cid').isMongoId().withMessage('Invalid cart ID'),
    param('pid').isMongoId().withMessage('Invalid product ID'),
    validateRequest,
    authPolicy(['user', 'admin']),
    validateCartExists,
    ensureOwnerOrAdmin,
    updateProductQuantity
)

cartRouter.delete(
    '/:cid',
    param('cid').isMongoId().withMessage('Invalid cart ID'),
    validateRequest,
    authPolicy(['user', 'admin']),
    validateCartExists,
    ensureOwnerOrAdmin,
    deleteCart
)

cartRouter.post(
    '/:cid/purchase',
    param('cid').isMongoId().withMessage('Invalid cart ID'),
    validateRequest,
    authPolicy(['user', 'admin']),
    validateCartExists,
    ensureOwnerOrAdmin,
    purchaseCart
)

cartRouter.post(
    '/:cid/products/:pid',
    param('cid').isMongoId().withMessage('Invalid cart ID'),
    param('pid').isMongoId().withMessage('Invalid product ID'),
    validateRequest,
    authPolicy(['user', 'admin']),
    validateCartExists,
    ensureOwnerOrAdmin,
    validateDTO(cartItemSchema),
    addProductToCart
)

cartRouter.delete(
    '/:cid/products/:pid',
    param('cid').isMongoId().withMessage('Invalid cart ID'),
    param('pid').isMongoId().withMessage('Invalid product ID'),
    validateRequest,
    authPolicy(['user', 'admin']),
    validateCartExists,
    ensureOwnerOrAdmin,
    removeProductFromCart
)

cartRouter.patch(
    '/:cid/products/:pid',
    param('cid').isMongoId().withMessage('Invalid cart ID'),
    param('pid').isMongoId().withMessage('Invalid product ID'),
    validateRequest,
    authPolicy(['user', 'admin']),
    validateCartExists,
    ensureOwnerOrAdmin,
    updateProductQuantity
)

cartRouter.put(
    '/:cid/products/:pid',
    param('cid').isMongoId().withMessage('Invalid cart ID'),
    param('pid').isMongoId().withMessage('Invalid product ID'),
    validateRequest,
    authPolicy(['user', 'admin']),
    validateCartExists,
    ensureOwnerOrAdmin,
    updateProductQuantity
)
