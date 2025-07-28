import ProductModel from '../models/product.model.js'

export class ProductDAO {
    async getAllProducts() {
        return await ProductModel.find()
    }

    async getProductById(id) {
        return await ProductModel.findById(id)
    }

    async getProductByCode(code) {
        return await ProductModel.findOne({ code })
    }

    async createProduct(productData) {
        return await ProductModel.create(productData)
    }

    async updateProduct(id, updateData) {
        return await ProductModel.findByIdAndUpdate(id, updateData, { new: true })
    }

    async deleteProduct(id) {
        return await ProductModel.findByIdAndDelete(id)
    }
}
