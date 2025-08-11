import { beforeEach, describe, expect, test, vi } from 'vitest'
import { CartService } from '../../../src/services/cart.service.js'

const getAllCarts = vi.fn()
const getCartById = vi.fn()
const getCartByUserId = vi.fn()
const createCart = vi.fn()
const updateCart = vi.fn()
const deleteCart = vi.fn()
const addProductToCart = vi.fn()
const removeProductFromCart = vi.fn()
const updateCartProducts = vi.fn()
const updateProductQuantity = vi.fn()
const purchaseCart = vi.fn()

vi.mock('../../../src/dto/cart.dto.js', () => ({
    asPublicCart: vi.fn((cart) => ({ id: cart._id || 'cart123' }))
}))

import { asPublicCart } from '../../../src/dto/cart.dto.js'

describe('CartService', () => {
    let service
    let daoMock

    beforeEach(() => {
        vi.clearAllMocks()

        daoMock = {
            getAllCarts,
            getCartById,
            getCartByUserId,
            createCart,
            updateCart,
            deleteCart,
            addProductToCart,
            removeProductFromCart,
            updateCartProducts,
            updateProductQuantity,
            purchaseCart
        }

        service = new CartService(daoMock)
    })

    test('getAllCarts', async () => {
        getAllCarts.mockResolvedValue([{ _id: '1' }, { _id: '2' }])

        const result = await service.getAllCarts()

        expect(getAllCarts).toHaveBeenCalled()
        expect(asPublicCart).toHaveBeenCalledTimes(2)
        expect(result).toEqual([{ id: '1' }, { id: '2' }])
    })

    test('getCartById', async () => {
        getCartById.mockResolvedValue({ _id: 'abc' })

        const result = await service.getCartById('abc')

        expect(getCartById).toHaveBeenCalledWith('abc')
        expect(asPublicCart).toHaveBeenCalledWith({ _id: 'abc' })
        expect(result).toEqual({ id: 'abc' })
    })

    test('getCartByUserId', async () => {
        getCartByUserId.mockResolvedValue({ _id: 'user123' })

        const result = await service.getCartByUserId('user123')

        expect(getCartByUserId).toHaveBeenCalledWith('user123')
        expect(result).toEqual({ id: 'user123' })
    })

    test('createCart', async () => {
        createCart.mockResolvedValue({ _id: 'newCart' })

        const result = await service.createCart({ user: 'abc' })

        expect(createCart).toHaveBeenCalledWith({ user: 'abc' })
        expect(result).toEqual({ id: 'newCart' })
    })

    test('updateCart', async () => {
        updateCart.mockResolvedValue({ _id: 'xyz' })

        const result = await service.updateCart('xyz', { total: 123 })

        expect(updateCart).toHaveBeenCalledWith('xyz', { total: 123 })
        expect(result).toEqual({ id: 'xyz' })
    })

    test('deleteCart', async () => {
        deleteCart.mockResolvedValue(true)

        const result = await service.deleteCart('toDelete')

        expect(deleteCart).toHaveBeenCalledWith('toDelete')
        expect(result).toBe(true)
    })

    test('addProductToCart', async () => {
        addProductToCart.mockResolvedValue({ _id: 'cart123' })

        const result = await service.addProductToCart('cart123', 'prod456', 2)

        expect(addProductToCart).toHaveBeenCalledWith('cart123', 'prod456', 2)
        expect(result).toEqual({ id: 'cart123' })
    })

    test('removeProductFromCart', async () => {
        removeProductFromCart.mockResolvedValue({ _id: 'cart456' })

        const result = await service.removeProductFromCart('cart456', 'prod789')

        expect(removeProductFromCart).toHaveBeenCalledWith('cart456', 'prod789')
        expect(result).toEqual({ id: 'cart456' })
    })

    test('updateCartProducts', async () => {
        updateCartProducts.mockResolvedValue({ _id: 'cartUpdate' })

        const result = await service.updateCartProducts('cartUpdate', [{ product: 'p1', qty: 2 }])

        expect(updateCartProducts).toHaveBeenCalledWith('cartUpdate', [{ product: 'p1', qty: 2 }])
        expect(result).toEqual({ id: 'cartUpdate' })
    })

    test('updateProductQuantity', async () => {
        updateProductQuantity.mockResolvedValue({ _id: 'cart789' })

        const result = await service.updateProductQuantity('cart789', 'p2', 5)

        expect(updateProductQuantity).toHaveBeenCalledWith('cart789', 'p2', 5)
        expect(result).toEqual({ id: 'cart789' })
    })

    test('purchaseCart', async () => {
        const ticket = {
            code: 'abc-123',
            purchaser: 'user1@example.com',
            amount: 500,
            products: [{ product: { title: 'Product A', price: 250 }, quantity: 2 }]
        }

        purchaseCart.mockResolvedValue(ticket)

        const result = await service.purchaseCart('cartId123', { email: 'user1@example.com' })

        expect(purchaseCart).toHaveBeenCalledWith('cartId123', { email: 'user1@example.com' })
        expect(result).toEqual(ticket)
    })
})
