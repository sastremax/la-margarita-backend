import { beforeEach, describe, expect, test, vi } from 'vitest'
import * as productController from '../../../src/controllers/product.controller.js'
import { productService } from '../../../src/services/product.service.js'
import { ApiError } from '../../../src/utils/apiError.js'

vi.mock('../../../src/services/product.service.js')

const mockRes = () => {
    const res = {}
    res.status = vi.fn().mockReturnValue(res)
    res.json = vi.fn().mockReturnValue(res)
    res.end = vi.fn().mockReturnValue(res)
    return res
}

const next = vi.fn()

beforeEach(() => {
    vi.clearAllMocks()
})

describe('product.controller', () => {
    test('getAllProducts - should return all products', async () => {
        const req = {}
        const res = mockRes()
        productService.getAllProducts.mockResolvedValue(['p1', 'p2'])

        await productController.getAllProducts(req, res, next)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: ['p1', 'p2'] })
    })

    test('getProductById - should return product if found', async () => {
        const req = { params: { id: 'abc123' } }
        const res = mockRes()
        productService.getProductById.mockResolvedValue('product')

        await productController.getProductById(req, res, next)

        expect(productService.getProductById).toHaveBeenCalledWith('abc123')
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: 'product' })
    })

    test('getProductById - should throw 404 if product not found', async () => {
        const req = { params: { id: 'abc123' } }
        const res = mockRes()
        productService.getProductById.mockResolvedValue(null)

        await productController.getProductById(req, res, next)

        expect(next).toHaveBeenCalledWith(new ApiError(404, 'Product not found'))
    })

    test('createProduct - should create product and return it', async () => {
        const req = {
            body: {
                title: 'Product',
                description: 'Desc',
                price: 100,
                code: 'code123',
                category: 'food',
                stock: 5
            }
        }
        const res = mockRes()
        productService.createProduct.mockResolvedValue('created')

        await productController.createProduct(req, res, next)

        expect(productService.createProduct).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: 'created' })
    })

    test('createProduct - should throw 400 on invalid body', async () => {
        const req = {
            body: {
                title: '',
                price: -1
            }
        }
        const res = mockRes()

        await productController.createProduct(req, res, next)

        expect(next).toHaveBeenCalledWith(new ApiError(400, 'Invalid product data'))
    })

    test('updateProduct - should update and return product', async () => {
        const req = {
            params: { id: 'abc123' },
            body: { title: 'Updated' }
        }
        const res = mockRes()
        productService.updateProduct.mockResolvedValue('updated')

        await productController.updateProduct(req, res, next)

        expect(productService.updateProduct).toHaveBeenCalledWith('abc123', { title: 'Updated' })
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: 'updated' })
    })

    test('updateProduct - should throw 400 on invalid body', async () => {
        const req = {
            params: { id: 'abc123' },
            body: { price: -999 }
        }
        const res = mockRes()

        await productController.updateProduct(req, res, next)

        expect(next).toHaveBeenCalledWith(new ApiError(400, 'Invalid product data'))
    })

    test('updateProduct - should throw 404 if not found', async () => {
        const req = {
            params: { id: 'abc123' },
            body: { title: 'Updated' }
        }
        const res = mockRes()
        productService.updateProduct.mockResolvedValue(null)

        await productController.updateProduct(req, res, next)

        expect(next).toHaveBeenCalledWith(new ApiError(404, 'Product not found'))
    })

    test('deleteProduct - should delete and return 204', async () => {
        const req = { params: { id: 'abc123' } }
        const res = mockRes()
        productService.deleteProduct.mockResolvedValue(true)

        await productController.deleteProduct(req, res, next)

        expect(productService.deleteProduct).toHaveBeenCalledWith('abc123')
        expect(res.status).toHaveBeenCalledWith(204)
        expect(res.end).toHaveBeenCalled()
    })

    test('deleteProduct - should throw 404 if not found', async () => {
        const req = { params: { id: 'abc123' } }
        const res = mockRes()
        productService.deleteProduct.mockResolvedValue(null)

        await productController.deleteProduct(req, res, next)

        expect(next).toHaveBeenCalledWith(new ApiError(404, 'Product not found'))
    })
})
