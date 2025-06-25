import productService from '../services/product.service.js'

async function getAllProducts(req, res, next) {
    try {
        const products = await productService.getAllProducts()
        res.status(200).json({ status: 'success', data: products })
    } catch (error) {
        next(error)
    }
}

async function getProductById(req, res, next) {
    try {
        const product = await productService.getProductById(req.params.pid)
        res.status(200).json({ status: 'success', data: product })
    } catch (error) {
        next(error)
    }
}

async function createProduct(req, res, next) {
    try {
        const product = await productService.createProduct(req.body)
        res.status(201).json({ status: 'success', data: product })
    } catch (error) {
        next(error)
    }
}

async function updateProduct(req, res, next) {
    try {
        const product = await productService.updateProduct(req.params.pid, req.body)
        res.status(200).json({ status: 'success', data: product })
    } catch (error) {
        next(error)
    }
}

async function deleteProduct(req, res, next) {
    try {
        await productService.deleteProduct(req.params.pid)
        res.status(204).end()
    } catch (error) {
        next(error)
    }
}

const productController = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}

export default productController