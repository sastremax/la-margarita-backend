import CartDao from '../dao/cart.dao.js'
import ApiError from '../utils/apiError.js'

export default async function attachUserCart(req, res, next) {
    try {
        if (!req?.user?.cart) {
            throw new ApiError(400, 'User has no cart assigned')
        }

        const cart = await CartDao.getCartById(req.user.cart)

        if (!cart) {
            throw new ApiError(404, 'Cart not found')
        }

        req.cart = cart
        next()
    } catch (error) {
        next(error)
    }
}
