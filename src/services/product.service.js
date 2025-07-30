import { getFactory } from '../dao/factory.js'
import { asPublicProduct } from '../dto/product.dto.js'

let productDAO

const init = async () => {
    if (!productDAO) {
        const daos = await getFactory()
        productDAO = daos.ProductDAO
    }
}

class ProductService {
    async getAllProducts() {
        await init()
        const products = await productDAO.getAllProducts()
        return products.map(asPublicProduct)
    }

    async getProductById(id) {
        await init()
        const product = await productDAO.getProductById(id)
        return asPublicProduct(product)
    }

    async getProductByCode(code) {
        await init()
        const product = await productDAO.getProductByCode(code)
        return asPublicProduct(product)
    }

    async createProduct(productData) {
        await init()
        const product = await productDAO.createProduct(productData)
        return asPublicProduct(product)
    }

    async updateProduct(id, updateData) {
        await init()
        const product = await productDAO.updateProduct(id, updateData)
        return asPublicProduct(product)
    }

    async deleteProduct(id) {
        await init()
        return await productDAO.deleteProduct(id)
    }
}

export const productService = new ProductService()
