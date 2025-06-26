import sinon from 'sinon'
import ReviewService from '../../../src/services/review.service.js'
import ReviewDAO from '../../../src/dao/review.dao.js'

describe('Review Service', () => {
    afterEach(() => {
        sinon.restore()
    })

    it('debería crear una reseña', async () => {
        const data = { user: 'u1', lodging: 'l1', rating: 4, comment: 'Bien' }
        const created = { id: 'rev1', ...data }

        sinon.stub(ReviewDAO, 'createReview').resolves(created)

        const result = await ReviewService.createReview(data)
        expect(result).to.deep.equal(created)
    })

    it('debería obtener reseñas por alojamiento', async () => {
        const reviews = [{ id: 'r1' }, { id: 'r2' }]
        sinon.stub(ReviewDAO, 'getReviewsByLodging').resolves(reviews)

        const result = await ReviewService.getReviewsByLodging('l1')
        expect(result).to.deep.equal(reviews)
    })

    it('debería obtener resumen de reseñas por alojamiento', async () => {
        const summary = { average: 4.5, count: 10 }
        sinon.stub(ReviewDAO, 'getReviewSummary').resolves(summary)

        const result = await ReviewService.getReviewSummary('l1')
        expect(result).to.deep.equal(summary)
    })

    it('debería eliminar una reseña', async () => {
        sinon.stub(ReviewDAO, 'deleteReview').resolves(true)

        const result = await ReviewService.deleteReview('rev1')
        expect(result).to.be.true
    })
})
