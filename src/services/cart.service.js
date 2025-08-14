import { CartDAO } from '../dao/cart.dao.js'
import { asPublicCart } from '../dto/cart.dto.js'

export class CartService {
    constructor(dao) {
        this.dao = dao
    }

    async getAllCarts() {
        const carts = await this.dao.getAllCarts()
        return carts.map(asPublicCart)
    }

    async getCartById(id) {
        const cart = await this.dao.getCartById(id)
        return asPublicCart(cart)
    }

    async getCartByUserId(userId) {
        const cart = await this.dao.getCartByUserId(userId)
        return asPublicCart(cart)
    }

    async createCart(userId) {
        const cart = await this.dao.createCart({ user: userId, products: [] })
        return asPublicCart(cart)
    }

    async updateCart(id, updateData) {
        const cart = await this.dao.updateCart(id, updateData)
        return asPublicCart(cart)
    }

    async deleteCart(id) {
        return await this.dao.deleteCart(id)
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        const cart = await this.dao.addProductToCart(cartId, productId, quantity)
        return asPublicCart(cart)
    }

    async removeProductFromCart(cartId, productId) {
        const cart = await this.dao.removeProductFromCart(cartId, productId)
        return asPublicCart(cart)
    }

    async updateCartProducts(cartId, products) {
        const cart = await this.dao.updateCartProducts(cartId, products)
        return asPublicCart(cart)
    }

    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await this.dao.updateProductQuantity(cartId, productId, quantity)
        return asPublicCart(cart)
    }

    async purchaseCart(cartId, user) {
        const ticket = await this.dao.purchaseCart(cartId, user)
        return ticket
    }
}

const cartDAO = new CartDAO()
export const cartService = new CartService(cartDAO)
