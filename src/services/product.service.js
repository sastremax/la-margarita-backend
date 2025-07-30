import { ProductDAO } from '../dao/product.dao.js'
import { asPublicProduct } from '../dto/product.dto.js'

const productDAO = new ProductDAO()

class ProductService {
    async getAllProducts() {
        const products = await productDAO.getAllProducts()
        return products.map(asPublicProduct)
    }

    async getProductById(id) {
        const product = await productDAO.getProductById(id)
        return asPublicProduct(product)
    }

    async getProductByCode(code) {
        const product = await productDAO.getProductByCode(code)
        return asPublicProduct(product)
    }

    async createProduct(productData) {
        const product = await productDAO.createProduct(productData)
        return asPublicProduct(product)
    }

    async updateProduct(id, updateData) {
        const product = await productDAO.updateProduct(id, updateData)
        return asPublicProduct(product)
    }

    async deleteProduct(id) {
        return await productDAO.deleteProduct(id)
    }
}

export const productService = new ProductService()
