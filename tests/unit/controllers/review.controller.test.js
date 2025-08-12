import { beforeEach, describe, expect, test, vi } from 'vitest'
import * as controller from '../../../src/controllers/review.controller.js'
import { reviewService } from '../../../src/services/review.service.js'

vi.mock('../../../src/services/review.service.js')

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

describe('review.controller', () => {
    test('getAllReviews debería devolver paginación y data', async () => {
        const req = { query: { page: '2', limit: '5' } }
        const res = mockRes()
        reviewService.getAllReviews.mockResolvedValue({ total: 12, page: 2, pages: 3, data: [{ id: 'r1' }] })
        await controller.getAllReviews(req, res, next)
        expect(reviewService.getAllReviews).toHaveBeenCalledWith({ page: 2, limit: 5 })
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', total: 12, page: 2, pages: 3, data: [{ id: 'r1' }] })
    })

    test('getReviewById debería usar req.params.rid y 404 si no existe', async () => {
        const res = mockRes()
        reviewService.getReviewById.mockResolvedValueOnce(null)
        await controller.getReviewById({ params: { rid: '507f1f77bcf86cd799439011' } }, res, next)
        expect(reviewService.getReviewById).toHaveBeenCalledWith('507f1f77bcf86cd799439011')
        expect(res.status).toHaveBeenCalledWith(404)

        const res2 = mockRes()
        reviewService.getReviewById.mockResolvedValueOnce({ id: 'r1' })
        await controller.getReviewById({ params: { rid: '507f1f77bcf86cd799439011' } }, res2, next)
        expect(res2.status).toHaveBeenCalledWith(200)
        expect(res2.json).toHaveBeenCalledWith({ status: 'success', data: { id: 'r1' } })
    })

    test('updateReview debería pasar rid y req.user.id', async () => {
        const req = { params: { rid: '507f1f77bcf86cd799439011' }, user: { id: 'u1' }, body: { rating: 5 } }
        const res = mockRes()
        reviewService.updateReview.mockResolvedValue({ id: 'r1', rating: 5 })
        await controller.updateReview(req, res, next)
        expect(reviewService.updateReview).toHaveBeenCalledWith('507f1f77bcf86cd799439011', 'u1', { rating: 5 })
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: { id: 'r1', rating: 5 } })
    })

    test('deleteReview debería usar rid y devolver 200', async () => {
        const req = { params: { rid: '507f1f77bcf86cd799439011' } }
        const res = mockRes()
        reviewService.deleteReview.mockResolvedValue(true)
        await controller.deleteReview(req, res, next)
        expect(reviewService.deleteReview).toHaveBeenCalledWith('507f1f77bcf86cd799439011')
        expect(res.status).toHaveBeenCalledWith(200)
    })

    test('createReview debería devolver 201', async () => {
        const req = { body: { user: 'u1', lodging: 'l1', reservation: 'z1', rating: 5, comment: 'x' } }
        const res = mockRes()
        reviewService.createReview.mockResolvedValue({ id: 'r1' })
        await controller.createReview(req, res, next)
        expect(reviewService.createReview).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(201)
    })
})
