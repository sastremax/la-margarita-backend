import { expect } from 'chai'
import sinon from 'sinon'
import ReviewService from '../../../src/services/review.service.js'
import ReviewDAO from '../../../src/dao/review.dao.js'
import reviewDTO from '../../../src/dto/review.dto.js'

const dto = { asPublicReview: reviewDTO.asPublicReview }

const fakeReview = {
    _id: '1',
    user: {
        _id: 'u1',
        firstName: 'John',
        country: 'Argentina'
    },
    lodging: 'l1',
    rating: 4,
    comment: 'Great stay!',
    isDeleted: false
}

describe('Review Service', () => {
    beforeEach(() => {
        sinon.restore()
    })

    it('should get all reviews with pagination', async () => {
        const paginated = {
            total: 1,
            page: 1,
            pages: 1,
            data: [fakeReview]
        }

        sinon.stub(ReviewDAO.prototype, 'getAllReviews').resolves(paginated)
        sinon.stub(dto, 'asPublicReview').callsFake(r => ({
            id: r._id,
            lodgingId: r.lodging,
            rating: r.rating,
            comment: r.comment,
            user: { id: r.user._id }
        }))

        const result = await ReviewService.getAllReviews({ page: 1, limit: 10 })
        expect(result.data[0]).to.have.nested.property('user.id', 'u1')
    })

    it('should get review by ID', async () => {
        sinon.stub(ReviewDAO.prototype, 'getReviewById').resolves(fakeReview)
        sinon.stub(dto, 'asPublicReview').callsFake(r => ({
            id: r._id,
            lodgingId: r.lodging,
            rating: r.rating,
            comment: r.comment,
            user: { id: r.user._id }
        }))

        const result = await ReviewService.getReviewById('1')
        expect(result).to.have.nested.property('user.id', 'u1')
    })

    it('should get reviews by lodging with filters', async () => {
        const resultFromDAO = {
            total: 1,
            page: 1,
            limit: 10,
            reviews: [fakeReview]
        }

        sinon.stub(ReviewDAO.prototype, 'getReviewsByLodgingWithFilters').resolves(resultFromDAO)
        sinon.stub(dto, 'asPublicReview').callsFake(r => ({
            id: r._id,
            lodgingId: r.lodging,
            rating: r.rating,
            comment: r.comment,
            user: { id: r.user._id }
        }))

        const result = await ReviewService.getReviewsByLodgingId('l1', { page: 1, limit: 10, filters: {} })
        expect(result.reviews[0]).to.have.nested.property('user.id', 'u1')
    })

    it('should get review by reservation ID', async () => {
        sinon.stub(ReviewDAO.prototype, 'getReviewByReservationId').resolves(fakeReview)

        const result = await ReviewService.getReviewByReservation('r1')
        expect(result).to.deep.equal(fakeReview)
    })

    it('should create a review', async () => {
        sinon.stub(ReviewDAO.prototype, 'createReview').resolves(fakeReview)
        sinon.stub(dto, 'asPublicReview').callsFake(r => ({
            id: r._id,
            lodgingId: r.lodging,
            rating: r.rating,
            comment: r.comment,
            user: { id: r.user._id }
        }))

        const result = await ReviewService.createReview(fakeReview)
        expect(result).to.have.nested.property('user.id', 'u1')
    })

    it('should soft-delete a review', async () => {
        sinon.stub(ReviewDAO.prototype, 'deleteReview').resolves(fakeReview)
        sinon.stub(dto, 'asPublicReview').callsFake(r => ({
            id: r._id,
            lodgingId: r.lodging,
            rating: r.rating,
            comment: r.comment,
            user: { id: r.user._id }
        }))

        const result = await ReviewService.deleteReview('1')
        expect(result).to.have.nested.property('user.id', 'u1')
    })

    it('should reply to a review', async () => {
        sinon.stub(ReviewDAO.prototype, 'replyToReview').resolves(fakeReview)
        sinon.stub(dto, 'asPublicReview').callsFake(r => ({
            id: r._id,
            lodgingId: r.lodging,
            rating: r.rating,
            comment: r.comment,
            user: { id: r.user._id }
        }))

        const result = await ReviewService.replyToReview('1', 'Thanks for your feedback!')
        expect(result).to.have.nested.property('user.id', 'u1')
    })

    it('should return review summary', async () => {
        const summary = {
            totalReviews: 20,
            averageRating: '4.30'
        }

        sinon.stub(ReviewDAO.prototype, 'getReviewSummary').resolves(summary)

        const result = await ReviewService.getReviewSummary('l1')
        expect(result).to.deep.equal(summary)
    })
})