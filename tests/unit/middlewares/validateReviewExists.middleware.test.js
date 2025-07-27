
import { expect } from 'chai'
import sinon from 'sinon'
import validateReviewExists from '../../../src/middlewares/validateReviewExists.js'
import reviewService from '../../../src/services/review.service.js'
import ApiError from '../../../src/utils/apiError.js'

describe('validateReviewExists.middleware', () => {
    let req, res, next

    beforeEach(() => {
        req = { params: {} }
        res = {}
        next = sinon.stub()
    })

    afterEach(() => {
        sinon.restore()
    })

    it('debería lanzar error 400 si no hay rid', async () => {
        await validateReviewExists(req, res, next)

        expect(next.calledOnce).to.be.true
        const err = next.firstCall.args[0]
        expect(err).to.be.instanceOf(ApiError)
        expect(err.statusCode).to.equal(400)
        expect(err.message).to.equal('Missing review ID')
    })

    it('debería lanzar error 404 si la review no existe', async () => {
        req.params.rid = 'fake-id'
        sinon.stub(reviewService, 'getReviewById').resolves(null)

        await validateReviewExists(req, res, next)

        const err = next.firstCall.args[0]
        expect(err).to.be.instanceOf(ApiError)
        expect(err.statusCode).to.equal(404)
        expect(err.message).to.equal('Review not found')
    })

    it('debería llamar a next si la review existe', async () => {
        req.params.rid = 'valid-id'
        sinon.stub(reviewService, 'getReviewById').resolves({ id: 'valid-id' })

        await validateReviewExists(req, res, next)

        expect(next.calledOnceWithExactly()).to.be.true
    })

    it('debería capturar y pasar errores inesperados', async () => {
        req.params.rid = 'some-id'
        const error = new Error('DB error')
        sinon.stub(reviewService, 'getReviewById').throws(error)

        await validateReviewExists(req, res, next)

        expect(next.calledOnceWithExactly(error)).to.be.true
    })
})
