import { ProductDAO } from '../dao/product.dao.js'
import { asPublicProduct } from '../dto/product.dto.js'

const productDAO = new ProductDAO()

export class ProductService {
    static async getAllProducts() {
        const products = await productDAO.getAllProducts()
        return products.map(asPublicProduct)
    }

    static async getProductById(id) {
        const product = await productDAO.getProductById(id)
        return asPublicProduct(product)
    }

    static async getProductByCode(code) {
        const product = await productDAO.getProductByCode(code)
        return asPublicProduct(product)
    }

    static async createProduct(productData) {
        const product = await productDAO.createProduct(productData)
        return asPublicProduct(product)
    }

    static async updateProduct(id, updateData) {
        const product = await productDAO.updateProduct(id, updateData)
        return asPublicProduct(product)
    }

    static async deleteProduct(id) {
        return await productDAO.deleteProduct(id)
    }
}
