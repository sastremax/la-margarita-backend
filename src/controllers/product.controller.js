import { asPublicProduct } from '../dto/product.dto.js'
import { productService } from '../services/product.service.js'

export const createProduct = async (req, res, next) => {
    try {
        const product = await productService.createProduct(req.body)
        res.status(201).json({ status: 'success', data: asPublicProduct(product) })
    } catch (error) {
        next(error)
    }
}

export const getAllProducts = async (req, res, next) => {
    try {
        const products = await productService.getAllProducts()
        const publicProducts = products.map(asPublicProduct)
        res.status(200).json({ status: 'success', data: publicProducts })
    } catch (error) {
        next(error)
    }
}

export const getProductById = async (req, res, next) => {
    try {
        const product = await productService.getProductById(req.params.id)
        res.status(200).json({ status: 'success', data: asPublicProduct(product) })
    } catch (error) {
        next(error)
    }
}

export const updateProduct = async (req, res, next) => {
    try {
        const updatedProduct = await productService.updateProduct(req.params.id, req.body)
        res.status(200).json({ status: 'success', data: asPublicProduct(updatedProduct) })
    } catch (error) {
        next(error)
    }
}

export const deleteProduct = async (req, res, next) => {
    try {
        await productService.deleteProduct(req.params.id)
        res.status(204).end()
    } catch (error) {
        next(error)
    }
}
