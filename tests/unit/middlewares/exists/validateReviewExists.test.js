import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../../../src/services/review.service.js', () => {
    const getReviewById = vi.fn()
    return { reviewService: { getReviewById }, __mocks: { getReviewById } }
})

import { __mocks } from '../../../../src/services/review.service.js'
import { validateReviewExists } from '../../../../src/middlewares/exists/validateReviewExists.js'
import { ApiError } from '../../../../src/utils/apiError.js'

describe('validateReviewExists', () => {
    let req, res, next

    beforeEach(() => {
        vi.clearAllMocks()
        req = { params: { rid: 'r1' } }
        res = {}
        next = vi.fn()
    })

    it('debería adjuntar review y seguir si existe', async () => {
        __mocks.getReviewById.mockResolvedValue({ id: 'r1' })
        await validateReviewExists(req, res, next)
        expect(__mocks.getReviewById).toHaveBeenCalledWith('r1')
        expect(req.review).toEqual({ id: 'r1' })
        expect(next).toHaveBeenCalled()
    })

    it('debería lanzar 400 si falta id', async () => {
        req.params = {}
        await validateReviewExists(req, res, next)
        const err = next.mock.calls[0][0]
        expect(err).toBeInstanceOf(ApiError)
        expect(err.statusCode).toBe(400)
    })

    it('debería lanzar 404 si no existe', async () => {
        __mocks.getReviewById.mockResolvedValue(null)
        await validateReviewExists(req, res, next)
        const err = next.mock.calls[0][0]
        expect(err).toBeInstanceOf(ApiError)
        expect(err.statusCode).toBe(404)
    })
})
