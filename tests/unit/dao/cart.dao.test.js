import mongoose from 'mongoose'
import { beforeEach, describe, expect, test, vi } from 'vitest'

vi.mock('../../../src/models/cart.model.js', async () => {
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

vi.mock('../../../src/models/ticket.model.js', async () => {
    return {
        default: {
            create: vi.fn()
        }
    }
})

let CartModel
let TicketModel
let CartDAO
let cartDAO

beforeEach(async () => {
    vi.clearAllMocks()

    CartModel = (await import('../../../src/models/cart.model.js')).default
    TicketModel = (await import('../../../src/models/ticket.model.js')).default
        ; ({ CartDAO } = await import('../../../src/dao/cart.dao.js'))
    cartDAO = new CartDAO()
})

describe('CartDAO', () => {
    test('getCartById should call findById with valid ID', async () => {
        const id = new mongoose.Types.ObjectId().toString()
        CartModel.findById.mockReturnValue({ populate: vi.fn() })
        await cartDAO.getCartById(id)
        expect(CartModel.findById).toHaveBeenCalledWith(id)
    })

    test('getCartById should throw error if ID is invalid', async () => {
        await expect(cartDAO.getCartById('invalid')).rejects.toThrow('Invalid cart ID')
    })

    test('getCartByUserId should call findOne with valid user ID', async () => {
        const userId = new mongoose.Types.ObjectId().toString()
        CartModel.findOne.mockReturnValue({ populate: vi.fn() })
        await cartDAO.getCartByUserId(userId)
        expect(CartModel.findOne).toHaveBeenCalledWith({ user: userId })
    })

    test('createCart should call CartModel.create with data', async () => {
        const data = { user: 'uid123' }
        CartModel.create.mockResolvedValue(data)
        const result = await cartDAO.createCart(data)
        expect(CartModel.create).toHaveBeenCalledWith(data)
        expect(result).toEqual(data)
    })

    test('updateCart should validate ID and call findByIdAndUpdate', async () => {
        const id = new mongoose.Types.ObjectId().toString()
        const update = { user: 'u2' }
        CartModel.findByIdAndUpdate.mockReturnValue({ populate: vi.fn() })
        await cartDAO.updateCart(id, update)
        expect(CartModel.findByIdAndUpdate).toHaveBeenCalledWith(id, update, { new: true })
    })

    test('deleteCart should validate ID and call findByIdAndDelete', async () => {
        const id = new mongoose.Types.ObjectId().toString()
        await cartDAO.deleteCart(id)
        expect(CartModel.findByIdAndDelete).toHaveBeenCalledWith(id)
    })

    test('addProductToCart should update existing product quantity', async () => {
        const cid = new mongoose.Types.ObjectId().toString()
        const pid = new mongoose.Types.ObjectId().toString()
        const cart = {
            products: [{ product: pid, quantity: 1 }],
            save: vi.fn(),
            populate: vi.fn()
        }
        CartModel.findById.mockResolvedValue(cart)
        await cartDAO.addProductToCart(cid, pid, 2)
        expect(cart.products[0].quantity).toBe(3)
        expect(cart.save).toHaveBeenCalled()
        expect(cart.populate).toHaveBeenCalledWith('products.product')
    })

    test('addProductToCart should add new product if not exists', async () => {
        const cid = new mongoose.Types.ObjectId().toString()
        const pid = new mongoose.Types.ObjectId().toString()
        const cart = {
            products: [],
            save: vi.fn(),
            populate: vi.fn()
        }
        CartModel.findById.mockResolvedValue(cart)
        await cartDAO.addProductToCart(cid, pid, 1)
        expect(cart.products.length).toBe(1)
        expect(cart.products[0].product.toString()).toBe(pid)
    })

    test('removeProductFromCart should remove product from cart', async () => {
        const cid = new mongoose.Types.ObjectId().toString()
        const pid = new mongoose.Types.ObjectId().toString()
        const cart = {
            products: [{ product: pid }],
            save: vi.fn(),
            populate: vi.fn()
        }
        CartModel.findById.mockResolvedValue(cart)
        await cartDAO.removeProductFromCart(cid, pid)
        expect(cart.products.length).toBe(0)
    })

    test('updateCartProducts should replace product list', async () => {
        const cid = new mongoose.Types.ObjectId().toString()
        const pid = new mongoose.Types.ObjectId().toString()
        const cart = {
            products: [],
            save: vi.fn(),
            populate: vi.fn()
        }
        CartModel.findById.mockResolvedValue(cart)
        await cartDAO.updateCartProducts(cid, [{ product: pid, quantity: 2 }])
        expect(cart.products.length).toBe(1)
        expect(cart.products[0].quantity).toBe(2)
    })

    test('updateProductQuantity should modify quantity', async () => {
        const cid = new mongoose.Types.ObjectId().toString()
        const pid = new mongoose.Types.ObjectId().toString()
        const cart = {
            products: [{ product: pid, quantity: 1 }],
            save: vi.fn(),
            populate: vi.fn()
        }
        CartModel.findById.mockResolvedValue(cart)
        await cartDAO.updateProductQuantity(cid, pid, 5)
        expect(cart.products[0].quantity).toBe(5)
    })

    test('purchaseCart should create ticket and empty cart', async () => {
        const cid = new mongoose.Types.ObjectId().toString()
        const cart = {
            products: [{
                product: { _id: 'p1', title: 'Product', price: 100 },
                quantity: 2
            }],
            save: vi.fn(),
            populate: vi.fn().mockResolvedValue(undefined)
        }
        CartModel.findById.mockReturnValue({
            populate: vi.fn().mockResolvedValue(cart)
        })
        TicketModel.create.mockResolvedValue({ code: 'abc123' })
        const user = { email: 'test@example.com' }
        const ticket = await cartDAO.purchaseCart(cid, user)
        expect(ticket).toEqual({ code: 'abc123' })
        expect(cart.products).toEqual([])
        expect(cart.save).toHaveBeenCalled()
        expect(TicketModel.create).toHaveBeenCalledWith(
            expect.objectContaining({
                purchaser: 'test@example.com',
                amount: 200
            })
        )
    })
})
