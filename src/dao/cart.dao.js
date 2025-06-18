import CartModel from '../models/cart.model.js'

class CartDAO {
    static async getAllCarts() {
        return await CartModel.find()
    }

    static async getCartById(id) {
        return await CartModel.findById(id).populate('products.product')
    }

    static async getCartByUserId(userId) {
        return await CartModel.findOne({ user: userId }).populate('products.product')
    }

    static async createCart(cartData) {
        return await CartModel.create(cartData)
    }

    static async updateCart(id, updateData) {
        return await CartModel.findByIdAndUpdate(id, updateData, { new: true })
    }

    static async deleteCart(id) {
        return await CartModel.findByIdAndDelete(id)
    }
}

export default CartDAO
