import cartService from '../services/cart.service.js'

export async function createCart(req, res, next) {
    try {
        const cart = await cartService.createCart()
        res.status(201).json({ status: 'success', data: cart })
    } catch (error) {
        next(error)
    }
}

export async function getCartById(req, res, next) {
    try {
        const cart = await cartService.getCartById(req.params.id)
        res.status(200).json({ status: 'success', data: cart })
    } catch (error) {
        next(error)
    }
}

export async function addProductToCart(req, res, next) {
    try {
        const { cid, pid } = req.params
        const cart = await cartService.addProductToCart(cid, pid)
        res.status(200).json({ status: 'success', data: cart })
    } catch (error) {
        next(error)
    }
}

export async function deleteCart(req, res, next) {
    try {
        await cartService.deleteCart(req.params.cid)
        res.status(204).end()
    } catch (error) {
        next(error)
    }
}

export async function removeProductFromCart(req, res, next) {
    try {
        const { cid, pid } = req.params
        const updatedCart = await cartService.removeProductFromCart(cid, pid)
        res.status(200).json({ status: 'success', data: updatedCart })
    } catch (error) {
        next(error)
    }
}
