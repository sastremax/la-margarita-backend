import { describe, test, expect, vi, beforeEach } from 'vitest'
import { ProductService } from '../../../src/services/product.service.js'

vi.mock('../../../src/dao/product.dao.js', () => {
    return {
        ProductDAO: vi.fn().mockImplementation(() => ({
            getAllProducts: vi.fn().mockResolvedValue([{ id: '1' }, { id: '2' }]),
            getProductById: vi.fn().mockResolvedValue({ id: '1' }),
            getProductByCode: vi.fn().mockResolvedValue({ code: 'ABC123' }),
            createProduct: vi.fn().mockResolvedValue({ title: 'Test' }),
            updateProduct: vi.fn().mockResolvedValue({ title: 'Updated' }),
            deleteProduct: vi.fn().mockResolvedValue({ acknowledged: true })
        }))
    }
})

vi.mock('../../../src/dto/product.dto.js', async (importOriginal) => {
    const actual = await importOriginal()
    return {
        ...actual,
        asPublicProduct: vi.fn((product) => {
            return { ...(product || {}), public: true }
        })
    }
})

describe('ProductService', () => {
    const dao = new (vi.importActual('../../../src/dao/product.dao.js')).ProductDAO()

    beforeEach(() => {
        vi.clearAllMocks()
    })

    test('getAllProducts', async () => {
        const result = await ProductService.getAllProducts()
        expect(result).toEqual([
            { id: '1', public: true },
            { id: '2', public: true }
        ])
    })

    test('getProductById', async () => {
        const result = await ProductService.getProductById('1')
        expect(result).toEqual({ id: '1', public: true })
        expect(dao.getProductById).toHaveBeenCalledWith('1')
    })

    test('getProductByCode', async () => {
        const result = await ProductService.getProductByCode('ABC123')
        expect(result).toEqual({ code: 'ABC123', public: true })
        expect(dao.getProductByCode).toHaveBeenCalledWith('ABC123')
    })

    test('createProduct', async () => {
        const newProduct = { title: 'Test' }
        const result = await ProductService.createProduct(newProduct)
        expect(result).toEqual({ title: 'Test', public: true })
        expect(dao.createProduct).toHaveBeenCalledWith(newProduct)
    })

    test('updateProduct', async () => {
        const updated = { title: 'Updated' }
        const result = await ProductService.updateProduct('1', updated)
        expect(result).toEqual({ title: 'Updated', public: true })
        expect(dao.updateProduct).toHaveBeenCalledWith('1', updated)
    })

    test('deleteProduct', async () => {
        const result = await ProductService.deleteProduct('1')
        expect(result).toEqual({ acknowledged: true })
        expect(dao.deleteProduct).toHaveBeenCalledWith('1')
    })
})
