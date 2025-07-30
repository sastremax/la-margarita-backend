import { describe, test, expect, vi, beforeEach } from 'vitest'
import { productService } from '../../../src/services/product.service.js'

vi.mock('../../../src/dao/factory.js', () => ({
    getFactory: vi.fn().mockResolvedValue({
        ProductDAO: {
            getAllProducts: vi.fn().mockResolvedValue([
                {
                    _id: '1',
                    title: 'A',
                    description: 'desc A',
                    price: 10,
                    code: 'A1',
                    category: 'food',
                    stock: 5,
                    images: []
                },
                {
                    _id: '2',
                    title: 'B',
                    description: 'desc B',
                    price: 20,
                    code: 'B1',
                    category: 'service',
                    stock: 10,
                    images: []
                }
            ]),
            getProductById: vi.fn().mockResolvedValue({
                _id: '1',
                title: 'A',
                description: 'desc A',
                price: 10,
                code: 'A1',
                category: 'food',
                stock: 5,
                images: []
            }),
            getProductByCode: vi.fn().mockResolvedValue({
                _id: 'p1',
                title: 'By Code',
                description: 'desc',
                price: 50,
                code: 'ABC123',
                category: 'food',
                stock: 20,
                images: []
            }),
            createProduct: vi.fn().mockResolvedValue({
                _id: 'new',
                title: 'New Product',
                description: 'desc new',
                price: 100,
                code: 'NEW123',
                category: 'service',
                stock: 30,
                images: []
            }),
            updateProduct: vi.fn().mockResolvedValue({
                _id: '1',
                title: 'Updated Product',
                description: 'updated desc',
                price: 150,
                code: 'A1',
                category: 'food',
                stock: 7,
                images: []
            }),
            deleteProduct: vi.fn().mockResolvedValue({ acknowledged: true })
        }
    })
}))

describe('ProductService', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    test('getAllProducts', async () => {
        const result = await productService.getAllProducts()

        expect(result).toEqual([
            {
                id: '1',
                title: 'A',
                description: 'desc A',
                price: 10,
                code: 'A1',
                category: 'food',
                stock: 5,
                images: []
            },
            {
                id: '2',
                title: 'B',
                description: 'desc B',
                price: 20,
                code: 'B1',
                category: 'service',
                stock: 10,
                images: []
            }
        ])
    })

    test('getProductById', async () => {
        const result = await productService.getProductById('1')

        expect(result).toEqual({
            id: '1',
            title: 'A',
            description: 'desc A',
            price: 10,
            code: 'A1',
            category: 'food',
            stock: 5,
            images: []
        })
    })

    test('getProductByCode', async () => {
        const result = await productService.getProductByCode('ABC123')

        expect(result).toEqual({
            id: 'p1',
            title: 'By Code',
            description: 'desc',
            price: 50,
            code: 'ABC123',
            category: 'food',
            stock: 20,
            images: []
        })
    })

    test('createProduct', async () => {
        const result = await productService.createProduct({
            title: 'New Product',
            description: 'desc new',
            price: 100,
            code: 'NEW123',
            category: 'service',
            stock: 30,
            images: []
        })

        expect(result).toEqual({
            id: 'new',
            title: 'New Product',
            description: 'desc new',
            price: 100,
            code: 'NEW123',
            category: 'service',
            stock: 30,
            images: []
        })
    })

    test('updateProduct', async () => {
        const result = await productService.updateProduct('1', {
            title: 'Updated Product',
            description: 'updated desc'
        })

        expect(result).toEqual({
            id: '1',
            title: 'Updated Product',
            description: 'updated desc',
            price: 150,
            code: 'A1',
            category: 'food',
            stock: 7,
            images: []
        })
    })

    test('deleteProduct', async () => {
        const result = await productService.deleteProduct('1')
        expect(result).toEqual({ acknowledged: true })
    })
})
