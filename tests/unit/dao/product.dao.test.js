import mongoose from 'mongoose'
import { beforeEach, describe, expect, test, vi } from 'vitest'

vi.mock('../../../src/models/product.model.js', async () => {
    return {
        default: {
            find: vi.fn(),
            findById: vi.fn(),
            findOne: vi.fn(),
            create: vi.fn(),
            findByIdAndUpdate: vi.fn(),
            findByIdAndDelete: vi.fn()
        }
    }
})

let ProductModel
let ProductDAO
let productDAO

beforeEach(async () => {
    vi.clearAllMocks()
    ProductModel = (await import('../../../src/models/product.model.js')).default
        ; ({ ProductDAO } = await import('../../../src/dao/product.dao.js'))
    productDAO = new ProductDAO()
})

describe('ProductDAO', () => {
    test('getAllProducts should call ProductModel.find', async () => {
        ProductModel.find.mockResolvedValue([{ title: 'Test Product' }])
        const result = await productDAO.getAllProducts()
        expect(ProductModel.find).toHaveBeenCalled()
        expect(result).toEqual([{ title: 'Test Product' }])
    })

    test('getProductById should call findById with correct id', async () => {
        const id = new mongoose.Types.ObjectId().toString()
        ProductModel.findById.mockResolvedValue({ _id: id })
        const result = await productDAO.getProductById(id)
        expect(ProductModel.findById).toHaveBeenCalledWith(id)
        expect(result).toEqual({ _id: id })
    })

    test('getProductByCode should call findOne with code', async () => {
        ProductModel.findOne.mockResolvedValue({ code: 'ABC123' })
        const result = await productDAO.getProductByCode('ABC123')
        expect(ProductModel.findOne).toHaveBeenCalledWith({ code: 'ABC123' })
        expect(result).toEqual({ code: 'ABC123' })
    })

    test('createProduct should call create with productData', async () => {
        const data = { title: 'New Product', price: 100 }
        ProductModel.create.mockResolvedValue(data)
        const result = await productDAO.createProduct(data)
        expect(ProductModel.create).toHaveBeenCalledWith(data)
        expect(result).toEqual(data)
    })

    test('updateProduct should call findByIdAndUpdate with data and options', async () => {
        const id = new mongoose.Types.ObjectId().toString()
        const updateData = { price: 150 }
        const updated = { _id: id, price: 150 }

        ProductModel.findByIdAndUpdate.mockResolvedValue(updated)
        const result = await productDAO.updateProduct(id, updateData)

        expect(ProductModel.findByIdAndUpdate).toHaveBeenCalledWith(id, updateData, { new: true })
        expect(result).toEqual(updated)
    })

    test('deleteProduct should call findByIdAndDelete with id', async () => {
        const id = new mongoose.Types.ObjectId().toString()
        const deleted = { _id: id }

        ProductModel.findByIdAndDelete.mockResolvedValue(deleted)
        const result = await productDAO.deleteProduct(id)

        expect(ProductModel.findByIdAndDelete).toHaveBeenCalledWith(id)
        expect(result).toEqual(deleted)
    })
})
