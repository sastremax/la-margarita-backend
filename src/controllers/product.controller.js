import productService from '../services/product.service.js'

const createProduct = async (req, res, next) => {
    try {
        const product = await productService.createProduct(req.body)
        res.status(201).json({ status: 'success', data: product })
    } catch (error) {
        next(error)
    }
}

const getAllProducts = async (req, res, next) => {
    try {
        const products = await productService.getAllProducts()
        res.status(200).json({ status: 'success', data: products })
    } catch (error) {
        next(error)
    }
}

const getProductById = async (req, res, next) => {
    try {
        const product = await productService.getProductById(req.params.id)
        res.status(200).json({ status: 'success', data: product })
    } catch (error) {
        next(error)
    }
}

const updateProduct = async (req, res, next) => {
    try {
        const updatedProduct = await productService.updateProduct(req.params.id, req.body)
        res.status(200).json({ status: 'success', data: updatedProduct })
    } catch (error) {
        next(error)
    }
}

const deleteProduct = async (req, res, next) => {
    try {
        await productService.deleteProduct(req.params.id)
        res.status(204).end()
    } catch (error) {
        next(error)
    }
}

export default {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
}