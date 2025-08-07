import mongoose from 'mongoose'
import ProductModel from '../models/product.model.js'

export class ProductDAO {
    async getAllProducts() {
        return await ProductModel.find()
    }

    async getProductById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid product ID')
        }
        return await ProductModel.findById(id)
    }

    async getProductByCode(code) {
        return await ProductModel.findOne({ code })
    }

    async createProduct(productData) {
        return await ProductModel.create(productData)
    }

    async updateProduct(id, updateData) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid product ID')
        }
        return await ProductModel.findByIdAndUpdate(id, updateData, { new: true })
    }

    async deleteProduct(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid product ID')
        }
        return await ProductModel.findByIdAndDelete(id)
    }
}
