import sinon from 'sinon'
import ReviewService from '../../../src/services/review.service.js'
import factory from '../../../src/dao/factory.js'

describe('Review Service', () => {
    afterEach(() => {
        sinon.restore()
    })

    it('debería crear una reseña', async () => {
        const data = { user: 'u1', lodging: 'l1', rating: 4, comment: 'Bien' }
        const created = { id: 'rev1', ...data }

        sinon.stub(factory.ReviewDAO, 'createReview').resolves(created)

        const result = await ReviewService.createReview(data)
        expect(result).to.deep.equal(created)
    })

    it('debería obtener reseñas por alojamiento', async () => {
        const reviews = [{ id: 'r1' }, { id: 'r2' }]
        sinon.stub(factory.ReviewDAO, 'getReviewsByLodging').resolves(reviews)

        const result = await ReviewService.getReviewsByLodging('l1')
        expect(result).to.deep.equal(reviews)
    })

    it('debería obtener resumen de reseñas por alojamiento', async () => {
        const summary = { average: 4.5, count: 10 }
        sinon.stub(factory.ReviewDAO, 'getReviewSummary').resolves(summary)

        const result = await ReviewService.getReviewSummary('l1')
        expect(result).to.deep.equal(summary)
    })

    it('debería eliminar una reseña', async () => {
        sinon.stub(factory.ReviewDAO, 'deleteReview').resolves(true)

        const result = await ReviewService.deleteReview('rev1')
        expect(result).to.be.true
    })
})