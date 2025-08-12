import { cartService } from '../services/cart.service.js'
import { ApiError } from '../utils/apiError.js'

export const validateCartExists = async (req, res, next) => {
    try {
        const cart = await cartService.getCartById(req.params.cid || req.params.id)
        if (!cart) throw new ApiError(404, 'Cart not found')
        req.cart = cart
        next()
    } catch (error) {
        next(error)
    }
}


