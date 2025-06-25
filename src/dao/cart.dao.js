import CartModel from '../models/cart.model.js'

class CartDAO {
    async getAllCarts() {
        return await CartModel.find()
    }

    async getCartById(id) {
        return await CartModel.findById(id).populate('products.product')
    }

    async getCartByUserId(userId) {
        return await CartModel.findOne({ user: userId }).populate('products.product')
    }

    async createCart(cartData) {
        return await CartModel.create(cartData)
    }

    async updateCart(id, updateData) {
        return await CartModel.findByIdAndUpdate(id, updateData, { new: true })
    }

    async deleteCart(id) {
        return await CartModel.findByIdAndDelete(id)
    }
}

export default CartDAO
