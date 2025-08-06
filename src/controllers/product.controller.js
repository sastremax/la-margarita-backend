import { productSchema } from '../dto/product.dto.js'
import { productService } from '../services/product.service.js'
import { ApiError } from '../utils/apiError.js'

export const createProduct = async (req, res, next) => {
    try {
        const parsed = productSchema.safeParse(req.body)
        if (!parsed.success) {
            throw new ApiError(400, 'Invalid product data')
        }

        const product = await productService.createProduct(parsed.data)
        res.status(201).json({ status: 'success', data: product })
    } catch (error) {
        next(error)
    }
}

export const getAllProducts = async (req, res, next) => {
    try {
        const products = await productService.getAllProducts()
        res.status(200).json({ status: 'success', data: products })
    } catch (error) {
        next(error)
    }
}

export const getProductById = async (req, res, next) => {
    try {
        const product = await productService.getProductById(req.params.id)
        if (!product) throw new ApiError(404, 'Product not found')
        res.status(200).json({ status: 'success', data: product })
    } catch (error) {
        next(error)
    }
}

export const updateProduct = async (req, res, next) => {
    try {
        const parsed = productSchema.partial().safeParse(req.body)
        if (!parsed.success) {
            throw new ApiError(400, 'Invalid product data')
        }

        const updated = await productService.updateProduct(req.params.id, parsed.data)
        if (!updated) throw new ApiError(404, 'Product not found')

        res.status(200).json({ status: 'success', data: updated })
    } catch (error) {
        next(error)
    }
}

export const deleteProduct = async (req, res, next) => {
    try {
        const deleted = await productService.deleteProduct(req.params.id)
        if (!deleted) throw new ApiError(404, 'Product not found')
        res.status(204).end()
    } catch (error) {
        next(error)
    }
}
