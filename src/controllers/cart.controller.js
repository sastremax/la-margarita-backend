import { cartDTO } from '../dto/cart.dto.js'
import { cartService } from '../services/cart.service.js'

export const createCart = async (req, res, next) => {
    try {
        const cart = await cartService.createCart()
        res.status(201).json({ status: 'success', data: cartDTO.asPublicCart(cart) })
    } catch (error) {
        next(error)
    }
}

export const getCartById = async (req, res, next) => {
    try {
        const cart = await cartService.getCartById(req.params.id)
        res.status(200).json({ status: 'success', data: cartDTO.asPublicCart(cart) })
    } catch (error) {
        next(error)
    }
}

export const addProductToCart = async (req, res, next) => {
    try {
        const { cid, pid } = req.params
        const cart = await cartService.addProductToCart(cid, pid)
        res.status(200).json({ status: 'success', data: cartDTO.asPublicCart(cart) })
    } catch (error) {
        next(error)
    }
}

export const deleteCart = async (req, res, next) => {
    try {
        await cartService.deleteCart(req.params.cid)
        res.status(204).end()
    } catch (error) {
        next(error)
    }
}

export const removeProductFromCart = async (req, res, next) => {
    try {
        const { cid, pid } = req.params
        const updatedCart = await cartService.removeProductFromCart(cid, pid)
        res.status(200).json({ status: 'success', data: cartDTO.asPublicCart(updatedCart) })
    } catch (error) {
        next(error)
    }
}

export const updateCartProducts = async (req, res, next) => {
    try {
        const { cid } = req.params
        const { products } = req.body
        const updatedCart = await cartService.updateCartProducts(cid, products)
        res.status(200).json({ status: 'success', data: cartDTO.asPublicCart(updatedCart) })
    } catch (error) {
        next(error)
    }
}

export const updateProductQuantity = async (req, res, next) => {
    try {
        const { cid, pid } = req.params
        const { quantity } = req.body
        const updatedCart = await cartService.updateProductQuantity(cid, pid, quantity)
        res.status(200).json({ status: 'success', data: cartDTO.asPublicCart(updatedCart) })
    } catch (error) {
        next(error)
    }
}

export const purchaseCart = async (req, res, next) => {
    try {
        const { cid } = req.params
        const user = req.user
        const ticket = await cartService.purchaseCart(cid, user)
        res.status(200).json({ status: 'success', data: ticket })
    } catch (error) {
        next(error)
    }
}
