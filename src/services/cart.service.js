import getFactory from '../dao/factory.js'
import cartDTO from '../dto/cart.dto.js'

const asCartPublic = cartDTO.asPublicCart

class CartService {
    constructor(dao) {
        this.dao = dao
    }

    async getAllCarts() {
        const carts = await this.dao.getAllCarts()
        return carts.map(asCartPublic)
    }

    async getCartById(id) {
        const cart = await this.dao.getCartById(id)
        return asCartPublic(cart)
    }

    async getCartByUserId(userId) {
        const cart = await this.dao.getCartByUserId(userId)
        return asCartPublic(cart)
    }

    async createCart(cartData) {
        const cart = await this.dao.createCart(cartData)
        return asCartPublic(cart)
    }

    async updateCart(id, updateData) {
        const cart = await this.dao.updateCart(id, updateData)
        return asCartPublic(cart)
    }

    async deleteCart(id) {
        return await this.dao.deleteCart(id)
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        const cart = await this.dao.addProductToCart(cartId, productId, quantity)
        return asCartPublic(cart)
    }

    async removeProductFromCart(cartId, productId) {
        const cart = await this.dao.removeProductFromCart(cartId, productId)
        return asCartPublic(cart)
    }

    async updateCartProducts(cartId, products) {
        const cart = await this.dao.updateCartProducts(cartId, products)
        return asCartPublic(cart)
    }

    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await this.dao.updateProductQuantity(cartId, productId, quantity)
        return asCartPublic(cart)
    }

    async purchaseCart(cartId, user) {
        const cart = await this.dao.purchaseCart(cartId, user)
        return asCartPublic(cart)
    }
}

const initializeCartService = async () => {
    const factory = await getFactory()
    return new CartService(factory.CartDAO)
}

export { CartService }
export default initializeCartService