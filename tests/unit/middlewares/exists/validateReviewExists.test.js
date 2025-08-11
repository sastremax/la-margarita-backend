import { beforeEach, describe, expect, test, vi } from 'vitest'
import { validateReviewExists } from '../../../../src/middlewares/exists/validateReviewExists.js'
import { reviewService } from '../../../../src/services/review.service.js'
import { ApiError } from '../../../../src/utils/apiError.js'

vi.mock('../../../../src/services/review.service.js', () => ({
    reviewService: {
        getReviewById: vi.fn()
    }
}))

describe('validateReviewExists middleware', () => {
    const next = vi.fn()
    const res = {}
    let req

    beforeEach(() => {
        vi.clearAllMocks()
        req = { params: {} }
    })

    test('should call next with 400 if no rid param is provided', async () => {
        await validateReviewExists(req, res, next)

        expect(next).toHaveBeenCalledWith(expect.any(ApiError))
        const error = next.mock.calls[0][0]
        expect(error.statusCode).toBe(400)
        expect(error.message).toBe('Missing review ID')
    })

    test('should call next with 404 if review is not found', async () => {
        req.params.rid = 'rev1'
        reviewService.getReviewById.mockResolvedValue(null)

        await validateReviewExists(req, res, next)

        expect(reviewService.getReviewById).toHaveBeenCalledWith('rev1')
        expect(next).toHaveBeenCalledWith(expect.any(ApiError))
        const error = next.mock.calls[0][0]
        expect(error.statusCode).toBe(404)
        expect(error.message).toBe('Review not found')
    })

    test('should call next with no arguments if review is found', async () => {
        req.params.rid = 'rev1'
        reviewService.getReviewById.mockResolvedValue({
            id: 'rev1',
            user: { id: 'u1', firstName: 'Maxi', country: 'Argentina' },
            lodgingId: 'l1',
            rating: 5,
            comment: 'Excelente'
        })

        await validateReviewExists(req, res, next)

        expect(reviewService.getReviewById).toHaveBeenCalledWith('rev1')
        expect(next).toHaveBeenCalledWith()
    })

    test('should call next with error if unexpected error occurs', async () => {
        req.params.rid = 'rev1'
        const error = new Error('DB error')
        reviewService.getReviewById.mockRejectedValue(error)

        await validateReviewExists(req, res, next)

        expect(next).toHaveBeenCalledWith(error)
    })
})
