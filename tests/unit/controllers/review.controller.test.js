import { beforeEach, describe, expect, test, vi } from 'vitest'
import * as reviewController from '../../../src/controllers/review.controller.js'
import { reviewService } from '../../../src/services/review.service.js'

vi.mock('../../../src/services/review.service.js', () => ({
    reviewService: {
        getAllReviews: vi.fn(),
        getReviewsByLodgingId: vi.fn(),
        createReview: vi.fn(),
        getReviewSummary: vi.fn(),
        deleteReview: vi.fn(),
        replyToReview: vi.fn(),
        getReviewById: vi.fn(),
        getRepliedReviewsByLodging: vi.fn(),
        updateReview: vi.fn()
    }
}))

describe('review.controller', () => {
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

    test('getAllReviews - success', async () => {
        const req = { query: { page: '1', limit: '10' } }
        const res = mockRes()
        reviewService.getAllReviews.mockResolvedValue({ total: 1, page: 1, pages: 1, data: ['r1'] })

        await reviewController.getAllReviews(req, res, next)

        expect(reviewService.getAllReviews).toHaveBeenCalledWith({ page: 1, limit: 10 })
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            total: 1,
            page: 1,
            pages: 1,
            data: ['r1']
        })
    })

    test('getReviewsByLodging - success', async () => {
        const req = {
            params: { lodgingId: 'abc' },
            query: { page: '1', limit: '5', hasReply: 'true', minRating: '3' }
        }
        const res = mockRes()
        reviewService.getReviewsByLodgingId.mockResolvedValue('filteredReviews')

        await reviewController.getReviewsByLodging(req, res, next)

        expect(reviewService.getReviewsByLodgingId).toHaveBeenCalledWith('abc', {
            page: 1,
            limit: 5,
            filters: { hasReply: true, minRating: 3 }
        })
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: 'filteredReviews' })
    })

    test('createReview - success', async () => {
        const req = { body: { comment: 'Great stay!' } }
        const res = mockRes()
        reviewService.createReview.mockResolvedValue('newReview')

        await reviewController.createReview(req, res, next)

        expect(reviewService.createReview).toHaveBeenCalledWith(req.body)
        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: 'newReview' })
    })

    test('getReviewSummary - success', async () => {
        const req = { params: { lodgingId: 'abc' } }
        const res = mockRes()
        reviewService.getReviewSummary.mockResolvedValue('summary')

        await reviewController.getReviewSummary(req, res, next)

        expect(reviewService.getReviewSummary).toHaveBeenCalledWith('abc')
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: 'summary' })
    })

    test('deleteReview - success', async () => {
        const req = { params: { id: 'r1' }, user: { _id: 'u1' } }
        const res = mockRes()
        reviewService.deleteReview.mockResolvedValue()

        await reviewController.deleteReview(req, res, next)

        expect(reviewService.deleteReview).toHaveBeenCalledWith('r1', 'u1')
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', message: 'Review deleted' })
    })

    test('putAdminReply - success', async () => {
        const req = { params: { id: 'r1' }, body: { message: 'Gracias por tu comentario.' } }
        const res = mockRes()
        reviewService.replyToReview.mockResolvedValue('repliedReview')

        await reviewController.putAdminReply(req, res, next)

        expect(reviewService.replyToReview).toHaveBeenCalledWith('r1', 'Gracias por tu comentario.')
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: 'repliedReview' })
    })

    test('getReviewById - success', async () => {
        const req = { params: { id: 'r1' } }
        const res = mockRes()
        reviewService.getReviewById.mockResolvedValue('review')

        await reviewController.getReviewById(req, res, next)

        expect(reviewService.getReviewById).toHaveBeenCalledWith('r1')
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: 'review' })
    })

    test('getReviewById - not found', async () => {
        const req = { params: { id: 'r1' } }
        const res = mockRes()
        reviewService.getReviewById.mockResolvedValue(null)

        await reviewController.getReviewById(req, res, next)

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({ status: 'error', message: 'Review not found' })
    })

    test('getRepliedReviewsByLodging - success', async () => {
        const req = { params: { lodgingId: 'abc' } }
        const res = mockRes()
        reviewService.getRepliedReviewsByLodging.mockResolvedValue(['review1'])

        await reviewController.getRepliedReviewsByLodging(req, res, next)

        expect(reviewService.getRepliedReviewsByLodging).toHaveBeenCalledWith('abc')
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: ['review1'] })
    })

    test('updateReview - success', async () => {
        const req = {
            params: { rid: 'r1' },
            user: { _id: 'u1' },
            body: { comment: 'Updated' }
        }
        const res = mockRes()
        reviewService.updateReview.mockResolvedValue('updatedReview')

        await reviewController.updateReview(req, res, next)

        expect(reviewService.updateReview).toHaveBeenCalledWith('r1', 'u1', req.body)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: 'updatedReview' })
    })
})
