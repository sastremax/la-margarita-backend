import { expect } from 'chai'
import notFound from '../../../src/middlewares/notFound.middleware.js'
import ApiError from '../../../src/utils/apiError.js'

describe('notFound.middleware', () => {
    it('should call next with ApiError 404 and correct message', () => {
        const req = { originalUrl: '/non-existent' }
        const next = (err) => {
            expect(err).to.be.instanceOf(ApiError)
            expect(err.statusCode).to.equal(404)
            expect(err.message).to.equal('Route /non-existent not found')
        }

        notFound(req, {}, next)
    })
})