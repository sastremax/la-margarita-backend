import { describe, test, expect, vi, beforeEach } from 'vitest'
import { reviewService } from '../../../src/services/review.service.js'
import { reviewDTO } from '../../../src/dto/review.dto.js'

const mockFns = {
    getAllReviews: vi.fn(),
    getReviewById: vi.fn(),
    getReviewsByLodgingWithFilters: vi.fn(),
    getReviewByReservationId: vi.fn(),
    createReview: vi.fn(),
    updateReview: vi.fn(),
    deleteReview: vi.fn(),
    replyToReview: vi.fn(),
    getReviewSummary: vi.fn()
}

vi.mock('../../../src/dao/review.dao.js', () => {
    return {
        ReviewDAO: vi.fn().mockImplementation(() => ({
            getAllReviews: (...args) => mockFns.getAllReviews(...args),
            getReviewById: (...args) => mockFns.getReviewById(...args),
            getReviewsByLodgingWithFilters: (...args) => mockFns.getReviewsByLodgingWithFilters(...args),
            getReviewByReservationId: (...args) => mockFns.getReviewByReservationId(...args),
            createReview: (...args) => mockFns.createReview(...args),
            updateReview: (...args) => mockFns.updateReview(...args),
            deleteReview: (...args) => mockFns.deleteReview(...args),
            replyToReview: (...args) => mockFns.replyToReview(...args),
            getReviewSummary: (...args) => mockFns.getReviewSummary(...args)
        }))
    }
})

beforeEach(() => {
    Object.values(mockFns).forEach(fn => fn.mockReset())
    reviewDTO.asPublicReview = vi.fn().mockImplementation(review => ({ ...review, public: true }))
})

describe('reviewService', () => {
    test('getAllReviews should return paginated reviews', async () => {
        mockFns.getAllReviews.mockResolvedValue({
            total: 1,
            page: 1,
            pages: 1,
            data: [{ id: 'abc' }]
        })

        const result = await reviewService.getAllReviews({ page: 1, limit: 10 })

        expect(result).toEqual({
            total: 1,
            page: 1,
            pages: 1,
            data: [{ id: 'abc', public: true }]
        })
    })

    test('getReviewById should return a single review', async () => {
        mockFns.getReviewById.mockResolvedValue({ id: 'abc' })

        const result = await reviewService.getReviewById('abc')

        expect(result).toEqual({ id: 'abc', public: true })
    })

    test('getReviewsByLodgingId should return filtered reviews', async () => {
        mockFns.getReviewsByLodgingWithFilters.mockResolvedValue({
            reviews: [{ id: 'abc' }]
        })

        const result = await reviewService.getReviewsByLodgingId('lodging1', {
            page: 1,
            limit: 10,
            filters: {}
        })

        expect(result).toEqual({ reviews: [{ id: 'abc', public: true }] })
    })

    test('getReviewByReservation should return review by reservation', async () => {
        mockFns.getReviewByReservationId.mockResolvedValue({ id: 'abc' })

        const result = await reviewService.getReviewByReservation('res1')

        expect(result).toEqual({ id: 'abc' })
    })

    test('createReview should return public review', async () => {
        mockFns.createReview.mockResolvedValue({ id: 'abc' })

        const result = await reviewService.createReview({ user: 'u1' })

        expect(result).toEqual({ id: 'abc', public: true })
    })

    test('updateReview should throw if review not found', async () => {
        mockFns.getReviewById.mockResolvedValue(null)

        await expect(reviewService.updateReview('r1', 'u1', {})).rejects.toThrow('Review not found')
    })

    test('updateReview should throw if user mismatch', async () => {
        mockFns.getReviewById.mockResolvedValue({ _id: 'r1', user: 'other' })

        await expect(reviewService.updateReview('r1', 'u1', {})).rejects.toThrow('Not authorized to update this review')
    })

    test('updateReview should return updated review', async () => {
        mockFns.getReviewById.mockResolvedValue({ _id: 'r1', user: 'u1' })
        mockFns.updateReview.mockResolvedValue({ id: 'abc' })

        const result = await reviewService.updateReview('r1', 'u1', { comment: 'updated' })

        expect(result).toEqual({ id: 'abc', public: true })
    })

    test('deleteReview should return deleted review', async () => {
        mockFns.deleteReview.mockResolvedValue({ id: 'abc' })

        const result = await reviewService.deleteReview('r1')

        expect(result).toEqual({ id: 'abc', public: true })
    })

    test('replyToReview should return replied review', async () => {
        mockFns.replyToReview.mockResolvedValue({ id: 'abc' })

        const result = await reviewService.replyToReview('r1', 'Gracias por su comentario')

        expect(result).toEqual({ id: 'abc', public: true })
    })

    test('getReviewSummary should return summary', async () => {
        mockFns.getReviewSummary.mockResolvedValue({ totalReviews: 5, averageRating: '4.60' })

        const result = await reviewService.getReviewSummary('lodging1')

        expect(result).toEqual({ totalReviews: 5, averageRating: '4.60' })
    })
})
