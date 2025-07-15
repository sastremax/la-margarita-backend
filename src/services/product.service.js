import ProductDAO from '../dao/product.dao.js'
import productDTO from '../dto/product.dto.js'

const productDAO = new ProductDAO()

class ProductService {
    static async getAllProducts() {
        const products = await productDAO.getAllProducts()
        return products.map(productDTO.asPublicProduct)
    }

    static async getProductById(id) {
        const product = await productDAO.getProductById(id)
        return productDTO.asPublicProduct(product)
    }

    static async getProductByCode(code) {
        const product = await productDAO.getProductByCode(code)
        return productDTO.asPublicProduct(product)
    }

    static async createProduct(productData) {
        const product = await productDAO.createProduct(productData)
        return productDTO.asPublicProduct(product)
    }

    static async updateProduct(id, updateData) {
        const product = await productDAO.updateProduct(id, updateData)
        return productDTO.asPublicProduct(product)
    }

    static async deleteProduct(id) {
        return await productDAO.deleteProduct(id)
    }
}

export default ProductService
