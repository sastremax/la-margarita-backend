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
}

export default CartService
