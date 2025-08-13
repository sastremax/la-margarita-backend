import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../../src/services/cart.service.js', () => {
    const getCartById = vi.fn()
    return { cartService: { getCartById }, __mocks: { getCartById } }
})

import { __mocks } from '../../../src/services/cart.service.js'
import { validateCartExists } from '../../../src/middlewares/validateCartExists.js'
import { ApiError } from '../../../src/utils/apiError.js'

describe('validateCartExists', () => {
    let req, res, next

    beforeEach(() => {
        vi.clearAllMocks()
        req = { params: { cid: 'c1' } }
        res = {}
        next = vi.fn()
    })

    it('debería adjuntar cart y seguir si existe', async () => {
        __mocks.getCartById.mockResolvedValue({ id: 'c1' })
        await validateCartExists(req, res, next)
        expect(__mocks.getCartById).toHaveBeenCalledWith('c1')
        expect(req.cart).toEqual({ id: 'c1' })
        expect(next).toHaveBeenCalled()
    })

    it('debería lanzar 404 si no existe', async () => {
        __mocks.getCartById.mockResolvedValue(null)
        await validateCartExists(req, res, next)
        const err = next.mock.calls[0][0]
        expect(err).toBeInstanceOf(ApiError)
        expect(err.statusCode).toBe(404)
    })
})
