import mongoose from 'mongoose'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { ReviewDAO } from '../../../src/dao/review.dao.js'
import ReviewModel from '../../../src/models/review.model.js'

vi.mock('../../../src/models/review.model.js', () => ({
    default: {
        countDocuments: vi.fn(),
        find: vi.fn(),
        findById: vi.fn(),
        findOne: vi.fn(),
        create: vi.fn(),
        aggregate: vi.fn()
    }
}))

const chainResult = (result) => {
    const chain = {
        populate: vi.fn(),
        skip: vi.fn(),
        limit: vi.fn(),
        sort: vi.fn(),
        lean: vi.fn(),
        exec: vi.fn()
    }
    chain.populate.mockReturnValue(chain)
    chain.skip.mockReturnValue(chain)
    chain.limit.mockReturnValue(chain)
    chain.sort.mockReturnValue(chain)
    chain.lean.mockReturnValue(Promise.resolve(result))
    chain.exec.mockReturnValue(Promise.resolve(result))
    return chain
}

describe('ReviewDAO', () => {
    let dao
    const validId = new mongoose.Types.ObjectId().toString()

    beforeEach(() => {
        vi.clearAllMocks()
        dao = new ReviewDAO()
    })

    test('getAllReviews should return paginated reviews', async () => {
        const rows = [{ _id: validId }]
        ReviewModel.countDocuments.mockResolvedValue(5)
        ReviewModel.find.mockReturnValue(chainResult(rows))
        const result = await dao.getAllReviews({ page: 1, limit: 2 })
        expect(result.total).toBe(5)
        expect(result.pages).toBe(3)
        expect(Array.isArray(result.data)).toBe(true)
        expect(result.data).toEqual(rows)
    })

    test('getReviewById should return review with populated fields', async () => {
        const row = { _id: validId }
        const chain = chainResult(row)
        ReviewModel.findById.mockReturnValue(chain)
        const result = await dao.getReviewById(validId)
        expect(result).toEqual(row)
        expect(chain.populate).toHaveBeenNthCalledWith(1, 'user', 'firstName lastName country')
        expect(chain.populate).toHaveBeenNthCalledWith(2, 'lodging', 'title location')
    })

    test('getReviewByReservationId should return matching review', async () => {
        const row = { _id: validId }
        ReviewModel.findOne.mockResolvedValue(row)
        const result = await dao.getReviewByReservationId('res123')
        expect(result).toEqual(row)
        expect(ReviewModel.findOne).toHaveBeenCalledWith({ reservation: 'res123' })
    })

    test('createReview should create a review', async () => {
        const data = { comment: 'Nice!' }
        const created = { _id: validId, ...data }
        ReviewModel.create.mockResolvedValue(created)
        const result = await dao.createReview(data)
        expect(result).toEqual(created)
        expect(ReviewModel.create).toHaveBeenCalledWith(data)
    })

    test('deleteReview should mark review as deleted', async () => {
        const save = vi.fn()
        const doc = { _id: validId, isDeleted: false, save }
        ReviewModel.findById.mockResolvedValue(doc)
        const result = await dao.deleteReview(validId)
        expect(result.isDeleted).toBe(true)
        expect(save).toHaveBeenCalled()
    })

    test('deleteReview should return null if not found', async () => {
        ReviewModel.findById.mockResolvedValue(null)
        const result = await dao.deleteReview(validId)
        expect(result).toBeNull()
    })

    test('replyToReview should set admin reply', async () => {
        const save = vi.fn()
        const doc = { _id: validId, save }
        ReviewModel.findById.mockResolvedValue(doc)
        const result = await dao.replyToReview(validId, 'Message')
        expect(result.adminReply.message).toBe('Message')
        expect(save).toHaveBeenCalled()
    })

    test('replyToReview should return null if not found', async () => {
        ReviewModel.findById.mockResolvedValue(null)
        const result = await dao.replyToReview(validId, 'Message')
        expect(result).toBeNull()
    })

    test('getReviewSummary should return 0 values if id invalid', async () => {
        const result = await dao.getReviewSummary('invalid_id')
        expect(result).toEqual({ totalReviews: 0, averageRating: '0.00' })
    })

    test('getReviewSummary should return correct values', async () => {
        ReviewModel.countDocuments.mockResolvedValue(2)
        ReviewModel.aggregate.mockResolvedValue([{ avgRating: 4.5 }])
        const result = await dao.getReviewSummary(validId)
        expect(result).toEqual({ totalReviews: 2, averageRating: '4.50' })
    })

    test('getReviewsByLodgingWithFilters should apply filters and paginate', async () => {
        const rows = [{ _id: validId }]
        ReviewModel.countDocuments.mockResolvedValue(1)
        ReviewModel.find.mockReturnValue(chainResult(rows))
        const result = await dao.getReviewsByLodgingWithFilters(validId, { page: 1, limit: 2, filters: {} })
        expect(result.total).toBe(1)
        expect(Array.isArray(result.reviews)).toBe(true)
        expect(result.reviews).toEqual(rows)
    })

    test('updateReview should update and save review', async () => {
        const save = vi.fn()
        const doc = { _id: validId, comment: 'Old', save }
        ReviewModel.findById.mockResolvedValue(doc)
        const result = await dao.updateReview(validId, { comment: 'Updated' })
        expect(result.comment).toBe('Updated')
        expect(save).toHaveBeenCalled()
    })

    test('updateReview should return null if review not found or deleted', async () => {
        ReviewModel.findById.mockResolvedValue(null)
        const result = await dao.updateReview(validId, { comment: 'Updated' })
        expect(result).toBeNull()
    })
})
