import CartDao from '../dao/cart.dao.js'

export default async function attachUserCart(req, res, next) {
    if (!req?.user?.cart) {
        return res.status(400).json({ status: 'error', message: 'User has no cart assigned' })
    }

    const cart = await CartDao.getCartById(req.user.cart)

    if (!cart) {
        return res.status(404).json({ status: 'error', message: 'Cart not found' })
    }

    req.cart = cart
    next()
}
