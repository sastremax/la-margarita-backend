import { describe, test, expect, vi, beforeEach } from 'vitest'
import { ApiError } from '../../../src/utils/apiError.js'

const getCartByIdMock = vi.fn() // ✅ Moverlo afuera del describe

vi.mock('../../../src/dao/cart.dao.js', () => {
    return {
        CartDAO: vi.fn().mockImplementation(() => ({
            getCartById: getCartByIdMock
        }))
    }
})

describe('attachUserCart middleware', () => {
    let attachUserCart
    const next = vi.fn()
    const res = {}
    let req

    beforeEach(async () => {
        vi.clearAllMocks()
        req = { user: {} }

        const module = await import('../../../src/middlewares/attachUserCart.middleware.js')
        attachUserCart = module.attachUserCart
    })

    test('should throw 400 if user has no cart assigned', async () => {
        await attachUserCart(req, res, next)

        expect(next).toHaveBeenCalledWith(expect.any(ApiError))
        const err = next.mock.calls[0][0]
        expect(err.statusCode).toBe(400)
        expect(err.message).toBe('User has no cart assigned')
    })

    test('should throw 404 if cart not found', async () => {
        req.user.cart = 'abc123'
        getCartByIdMock.mockResolvedValue(null)

        await attachUserCart(req, res, next)

        expect(getCartByIdMock).toHaveBeenCalledWith('abc123')
        expect(next).toHaveBeenCalledWith(expect.any(ApiError))
        const err = next.mock.calls[0][0]
        expect(err.statusCode).toBe(404)
        expect(err.message).toBe('Cart not found')
    })

    test('should attach cart to req and call next if found', async () => {
        req.user.cart = 'abc123'
        const mockCart = { id: 'abc123', products: [] }
        getCartByIdMock.mockResolvedValue(mockCart)

        await attachUserCart(req, res, next)

        expect(getCartByIdMock).toHaveBeenCalledWith('abc123')
        expect(req.cart).toEqual(mockCart)
        expect(next).toHaveBeenCalledWith()
    })

    test('should call next with error if unexpected exception occurs', async () => {
        req.user.cart = 'abc123'
        const error = new Error('DB error')
        getCartByIdMock.mockRejectedValue(error)

        await attachUserCart(req, res, next)

        expect(next).toHaveBeenCalledWith(error)
    })
})
