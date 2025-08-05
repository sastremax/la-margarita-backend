import { beforeEach, describe, expect, test, vi } from 'vitest'
import { ApiError } from '../../../src/utils/apiError.js'

let cartService
let validateCartExists

vi.mock('../../../src/services/cart.service.js', async () => {
    const actual = await vi.importActual('../../../src/services/cart.service.js')
    return {
        cartService: {
            ...actual.cartService,
            getCartById: vi.fn()
        }
    }
})

beforeEach(async () => {
    vi.clearAllMocks()
    const mod = await import('../../../src/middlewares/validateCartExists.js')
    validateCartExists = mod.validateCartExists
    cartService = (await import('../../../src/services/cart.service.js')).cartService
})

describe('validateCartExists middleware', () => {
    test('should call next() if cart exists', async () => {
        const req = { params: { cid: 'abc123' } }
        const res = {}
        const next = vi.fn()

        cartService.getCartById.mockResolvedValue({ id: 'abc123', products: [] })

        await validateCartExists(req, res, next)

        expect(cartService.getCartById).toHaveBeenCalledWith('abc123')
        expect(next).toHaveBeenCalledWith()
    })

    test('should call next with ApiError 404 if cart not found', async () => {
        const req = { params: { cid: 'notfound' } }
        const res = {}
        const next = vi.fn()

        cartService.getCartById.mockResolvedValue(null)

        await validateCartExists(req, res, next)

        expect(next).toHaveBeenCalledWith(expect.any(ApiError))
        const err = next.mock.calls[0][0]
        expect(err).toBeInstanceOf(ApiError)
        expect(err.statusCode).toBe(404)
        expect(err.message).toBe('Cart not found')
    })

    test('should call next with error if service throws', async () => {
        const req = { params: { cid: 'abc123' } }
        const res = {}
        const next = vi.fn()

        const thrownError = new Error('DB error')
        cartService.getCartById.mockRejectedValue(thrownError)

        await validateCartExists(req, res, next)

        expect(next).toHaveBeenCalledWith(thrownError)
    })
})
