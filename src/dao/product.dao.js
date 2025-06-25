import ProductModel from '../models/product.model.js'

class ProductDAO {
    static async getAllProducts() {
        return await ProductModel.find()
    }

    static async getProductById(id) {
        return await ProductModel.findById(id)
    }

    static async getProductByCode(code) {
        return await ProductModel.findOne({ code })
    }

    static async createProduct(productData) {
        return await ProductModel.create(productData)
    }

    static async updateProduct(id, updateData) {
        return await ProductModel.findByIdAndUpdate(id, updateData, { new: true })
    }

    static async deleteProduct(id) {
        return await ProductModel.findByIdAndDelete(id)
    }
}

export default ProductDAO
