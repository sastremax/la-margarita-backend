import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import CartModel from '../models/cart.model.js'
import TicketModel from '../models/ticket.model.js'

export class CartDAO {
    async getAllCarts() {
        return await CartModel.find().populate('products.product')
    }

    async getCartById(id) {
        return await CartModel.findById(id).populate('products.product')
    }

    async getCartByUserId(userId) {
        return await CartModel.findOne({ user: userId }).populate('products.product')
    }

    async createCart(cartData = {}) {
        return await CartModel.create(cartData)
    }

    async updateCart(id, updateData) {
        return await CartModel.findByIdAndUpdate(id, updateData, { new: true }).populate('products.product')
    }

    async deleteCart(id) {
        return await CartModel.findByIdAndDelete(id)
    }

    async addProductToCart(cid, pid, quantity = 1) {
        const cart = await CartModel.findById(cid)
        if (!cart) return null

        const existing = cart.products.find(p => p.product.toString() === pid)
        if (existing) {
            existing.quantity += quantity
        } else {
            cart.products.push({ product: new mongoose.Types.ObjectId(String(pid)), quantity })
        }

        await cart.save()
        return cart.populate('products.product')
    }

    async removeProductFromCart(cid, pid) {
        const cart = await CartModel.findById(cid)
        if (!cart) return null

        cart.products = cart.products.filter(p => p.product.toString() !== pid)
        await cart.save()
        return cart.populate('products.product')
    }

    async updateCartProducts(cid, products) {
        const cart = await CartModel.findById(cid)
        if (!cart) return null

        cart.products = products.map(p => ({
            product: new mongoose.Types.ObjectId(String(p.product)),
            quantity: p.quantity
        }))

        await cart.save()
        return cart.populate('products.product')
    }

    async updateProductQuantity(cid, pid, quantity) {
        const cart = await CartModel.findById(cid)
        if (!cart) return null

        const item = cart.products.find(p => p.product.toString() === pid)
        if (item) {
            item.quantity = quantity
            await cart.save()
        }

        return cart.populate('products.product')
    }

    async purchaseCart(cartId, user) {
        const cart = await CartModel.findById(cartId).populate('products.product')
        if (!cart || !Array.isArray(cart.products) || cart.products.length === 0) {
            return null
        }

        const productsForTicket = cart.products.map(p => ({
            product: {
                _id: p.product._id,
                title: p.product.title,
                price: p.product.price
            },
            quantity: p.quantity
        }))

        const amount = cart.products.reduce((total, p) => {
            return total + p.product.price * p.quantity
        }, 0)

        const ticket = await TicketModel.create({
            code: uuidv4(),
            purchaser: user.email,
            amount,
            products: productsForTicket
        })

        cart.products = []
        await cart.save()

        return ticket
    }
}
