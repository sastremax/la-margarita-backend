import factory from '../dao/factory.js'
import cartDTO from '../dto/cart.dto.js'

const asCartPublic = cartDTO.asPublicCart
const CartDAO = factory.CartDAO

class CartService {
    static async getAllCarts() {
        const carts = await CartDAO.getAllCarts()
        return carts.map(asCartPublic)
    }

    static async getCartById(id) {
        const cart = await CartDAO.getCartById(id)
        return asCartPublic(cart)
    }

    static async getCartByUserId(userId) {
        const cart = await CartDAO.getCartByUserId(userId)
        return asCartPublic(cart)
    }

    static async createCart(cartData) {
        const cart = await CartDAO.createCart(cartData)
        return asCartPublic(cart)
    }

    static async updateCart(id, updateData) {
        const cart = await CartDAO.updateCart(id, updateData)
        return asCartPublic(cart)
    }

    static async deleteCart(id) {
        return await CartDAO.deleteCart(id)
    }

    static async addProductToCart(cartId, productId, quantity = 1) {
        const cart = await CartDAO.addProductToCart(cartId, productId, quantity)
        return asCartPublic(cart)
    }

    static async removeProductFromCart(cartId, productId) {
        const cart = await CartDAO.removeProductFromCart(cartId, productId)
        return asCartPublic(cart)
    }

    static async updateCartProducts(cartId, products) {
        const cart = await CartDAO.updateCartProducts(cartId, products)
        return asCartPublic(cart)
    }

    static async updateProductQuantity(cartId, productId, quantity) {
        const cart = await CartDAO.updateProductQuantity(cartId, productId, quantity)
        return asCartPublic(cart)
    }

    static async purchaseCart(cartId, user) {
        const cart = await CartDAO.purchaseCart(cartId, user)
        return asCartPublic(cart)
    }
}

export default CartService
