import CartDAO from '../dao/cart.dao.js'

class CartService {
    static async getAllCarts() {
        return await CartDAO.getAllCarts()
    }

    static async getCartById(id) {
        return await CartDAO.getCartById(id)
    }

    static async getCartByUserId(userId) {
        return await CartDAO.getCartByUserId(userId)
    }

    static async createCart(cartData) {
        return await CartDAO.createCart(cartData)
    }

    static async updateCart(id, updateData) {
        return await CartDAO.updateCart(id, updateData)
    }

    static async deleteCart(id) {
        return await CartDAO.deleteCart(id)
    }

    static async addProductToCart(cartId, productId, quantity = 1) {
        return await CartDAO.addProductToCart(cartId, productId, quantity)
    }

    static async removeProductFromCart(cartId, productId) {
        return await CartDAO.removeProductFromCart(cartId, productId)
    }

    static async updateCartProducts(cartId, products) {
        return await CartDAO.updateCartProducts(cartId, products)
    }

    static async updateProductQuantity(cartId, productId, quantity) {
        return await CartDAO.updateProductQuantity(cartId, productId, quantity)
    }

    static async purchaseCart(cartId, user) {
        return await CartDAO.purchaseCart(cartId, user)
    }
}

export default CartService
