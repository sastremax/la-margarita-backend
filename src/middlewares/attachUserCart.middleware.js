import { CartDAO } from '../dao/cart.dao.js'
import { ApiError } from '../utils/apiError.js'

const cartDao = new CartDAO()

export const attachUserCart = async (req, res, next) => {
    try {
        if (!req?.user?.cart) {
            throw new ApiError(400, 'User has no cart assigned')
        }

        const cart = await cartDao.getCartById(req.user.cart)

        if (!cart) {
            throw new ApiError(404, 'Cart not found')
        }

        req.cart = cart
        next()
    } catch (error) {
        next(error)
    }
}
