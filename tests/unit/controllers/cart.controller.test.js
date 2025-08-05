import { describe, test, expect, vi, beforeEach } from 'vitest'

vi.mock('../../../src/services/cart.service.js', () => ({
    cartService: {
        purchaseCart: vi.fn()
    }
}))

import { cartService } from '../../../src/services/cart.service.js'
import { purchaseCart } from '../../../src/controllers/cart.controller.js'

describe('cart.controller - purchaseCart', () => {
    let req, res, next

    beforeEach(() => {
        vi.clearAllMocks()

        req = {
            params: { cid: 'cart123' },
            user: { email: 'user@example.com' }
        }

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        }

        next = vi.fn()
    })

    test('should return 200 and ticket on success', async () => {
        const fakeTicket = {
            code: 'abc-123',
            purchaser: 'user@example.com',
            amount: 300,
            products: [
                { product: { title: 'A', price: 150 }, quantity: 2 }
            ]
        }

        cartService.purchaseCart.mockResolvedValue(fakeTicket)

        await purchaseCart(req, res, next)

        expect(cartService.purchaseCart).toHaveBeenCalledWith('cart123', req.user)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: fakeTicket
        })
    })

    test('should return 400 if purchaseCart returns null', async () => {
        cartService.purchaseCart.mockResolvedValue(null)

        await purchaseCart(req, res, next)

        expect(cartService.purchaseCart).toHaveBeenCalledWith('cart123', req.user)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({
            status: 'error',
            message: 'Purchase failed: cart not found or empty'
        })
    })

    test('should call next(error) on exception', async () => {
        const error = new Error('DB error')
        cartService.purchaseCart.mockRejectedValue(error)

        await purchaseCart(req, res, next)

        expect(next).toHaveBeenCalledWith(error)
    })
})
