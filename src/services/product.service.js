import ProductDAO from '../dao/product.dao.js'

class ProductService {
    static async getAllProducts() {
        return await ProductDAO.getAllProducts()
    }

    static async getProductById(id) {
        return await ProductDAO.getProductById(id)
    }

    static async getProductByCode(code) {
        return await ProductDAO.getProductByCode(code)
    }

    static async createProduct(productData) {
        return await ProductDAO.createProduct(productData)
    }

    static async updateProduct(id, updateData) {
        return await ProductDAO.updateProduct(id, updateData)
    }

    static async deleteProduct(id) {
        return await ProductDAO.deleteProduct(id)
    }
}

export default ProductService
