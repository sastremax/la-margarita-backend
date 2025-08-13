import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../../src/dao/cart.dao.js', () => {
    const getCartById = vi.fn()
    return {
        CartDAO: vi.fn().mockImplementation(() => ({ getCartById })),
        __mocks: { getCartById }
    }
})

import { __mocks } from '../../../src/dao/cart.dao.js'
import { attachUserCart } from '../../../src/middlewares/attachUserCart.middleware.js'
import { ApiError } from '../../../src/utils/apiError.js'

describe('attachUserCart.middleware', () => {
    let req, res, next

    beforeEach(() => {
        vi.clearAllMocks()
        req = { user: { cart: 'c1' } }
        res = {}
        next = vi.fn()
    })

    it('debería adjuntar el cart y seguir', async () => {
        __mocks.getCartById.mockResolvedValue({ id: 'c1' })
        await attachUserCart(req, res, next)
        expect(__mocks.getCartById).toHaveBeenCalledWith('c1')
        expect(req.cart).toEqual({ id: 'c1' })
        expect(next).toHaveBeenCalled()
    })

    it('debería lanzar 400 si el usuario no tiene cart', async () => {
        req.user = {}
        await attachUserCart(req, res, next)
        const err = next.mock.calls[0][0]
        expect(err).toBeInstanceOf(ApiError)
        expect(err.statusCode).toBe(400)
    })

    it('debería lanzar 404 si el cart no existe', async () => {
        __mocks.getCartById.mockResolvedValue(null)
        await attachUserCart(req, res, next)
        const err = next.mock.calls[0][0]
        expect(err).toBeInstanceOf(ApiError)
        expect(err.statusCode).toBe(404)
    })
})
