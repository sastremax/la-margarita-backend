import { beforeEach, describe, expect, test, vi } from 'vitest'
import * as cartController from '../../../src/controllers/cart.controller.js'
import { cartService } from '../../../src/services/cart.service.js'

vi.mock('../../../src/services/cart.service.js')

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

describe('cart.controller', () => {
    test('debería crear carrito y devolver 201', async () => {
        const req = { user: { id: 'u1' } }
        const res = mockRes()
        cartService.createCart.mockResolvedValue({ id: 'c1', userId: 'u1', products: [] })
        await cartController.createCart(req, res, next)
        expect(cartService.createCart).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: { id: 'c1', userId: 'u1', products: [] } })
    })

    test('debería obtener por id y conservar userId (sin remapear) en GET', async () => {
        const req = { params: { id: 'c1' } }
        const res = mockRes()
        cartService.getCartById.mockResolvedValue({ id: 'c1', userId: 'u1', products: [] })
        await cartController.getCartById(req, res, next)
        expect(cartService.getCartById).toHaveBeenCalledWith('c1')
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: { id: 'c1', userId: 'u1', products: [] } })
    })

    test('debería agregar producto y devolver 200', async () => {
        const req = { params: { cid: 'c1', pid: 'p1' } }
        const res = mockRes()
        cartService.addProductToCart.mockResolvedValue({ id: 'c1', userId: 'u1', products: [{ productId: 'p1', quantity: 1 }] })
        await cartController.addProductToCart(req, res, next)
        expect(cartService.addProductToCart).toHaveBeenCalledWith('c1', 'p1')
        expect(res.status).toHaveBeenCalledWith(200)
    })

    test('debería eliminar carrito y devolver 204', async () => {
        const req = { params: { cid: 'c1' } }
        const res = mockRes()
        cartService.deleteCart.mockResolvedValue(true)
        await cartController.deleteCart(req, res, next)
        expect(cartService.deleteCart).toHaveBeenCalledWith('c1')
        expect(res.status).toHaveBeenCalledWith(204)
        expect(res.end).toHaveBeenCalled()
    })

    test('debería remover producto y devolver 200', async () => {
        const req = { params: { cid: 'c1', pid: 'p1' } }
        const res = mockRes()
        cartService.removeProductFromCart.mockResolvedValue({ id: 'c1', userId: 'u1', products: [] })
        await cartController.removeProductFromCart(req, res, next)
        expect(cartService.removeProductFromCart).toHaveBeenCalledWith('c1', 'p1')
        expect(res.status).toHaveBeenCalledWith(200)
    })

    test('debería actualizar productos del carrito y devolver 200', async () => {
        const req = { params: { cid: 'c1' }, body: { products: [{ productId: 'p1', quantity: 2 }] } }
        const res = mockRes()
        cartService.updateCartProducts.mockResolvedValue({ id: 'c1', userId: 'u1', products: [{ productId: 'p1', quantity: 2 }] })
        await cartController.updateCartProducts(req, res, next)
        expect(cartService.updateCartProducts).toHaveBeenCalledWith('c1', [{ productId: 'p1', quantity: 2 }])
        expect(res.status).toHaveBeenCalledWith(200)
    })

    test('debería actualizar cantidad de un producto y devolver 200', async () => {
        const req = { params: { cid: 'c1', pid: 'p1' }, body: { quantity: 3 } }
        const res = mockRes()
        cartService.updateProductQuantity.mockResolvedValue({ id: 'c1', userId: 'u1', products: [{ productId: 'p1', quantity: 3 }] })
        await cartController.updateProductQuantity(req, res, next)
        expect(cartService.updateProductQuantity).toHaveBeenCalledWith('c1', 'p1', 3)
        expect(res.status).toHaveBeenCalledWith(200)
    })

    test('debería devolver 400 si purchaseCart no genera ticket, y 200 si genera', async () => {
        const reqBad = { params: { cid: 'c404' }, user: { id: 'u1' } }
        const resBad = mockRes()
        cartService.purchaseCart.mockResolvedValueOnce(null)
        await cartController.purchaseCart(reqBad, resBad, next)
        expect(resBad.status).toHaveBeenCalledWith(400)

        const reqOk = { params: { cid: 'c1' }, user: { id: 'u1' } }
        const resOk = mockRes()
        cartService.purchaseCart.mockResolvedValueOnce({ ticketId: 't1', amount: 100 })
        await cartController.purchaseCart(reqOk, resOk, next)
        expect(resOk.status).toHaveBeenCalledWith(200)
        expect(resOk.json).toHaveBeenCalledWith({ status: 'success', data: { ticketId: 't1', amount: 100 } })
    })
})
