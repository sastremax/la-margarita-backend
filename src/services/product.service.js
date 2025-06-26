import ProductDAO from '../dao/product.dao.js'
import asProductPublic from '../dto/product.dto.js'

class ProductService {
    static async getAllProducts() {
        const products = await ProductDAO.getAllProducts()
        return products.map(asProductPublic)
    }

    static async getProductById(id) {
        const product = await ProductDAO.getProductById(id)
        return asProductPublic(product)
    }

    static async getProductByCode(code) {
        const product = await ProductDAO.getProductByCode(code)
        return asProductPublic(product)
    }

    static async createProduct(productData) {
        const product = await ProductDAO.createProduct(productData)
        return asProductPublic(product)
    }

    static async updateProduct(id, updateData) {
        const product = await ProductDAO.updateProduct(id, updateData)
        return asProductPublic(product)
    }

    static async deleteProduct(id) {
        return await ProductDAO.deleteProduct(id)
    }
}

export default ProductService