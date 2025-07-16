import { expect } from 'chai'
import originChecker from '../../../src/middlewares/originChecker.js'
import ApiError from '../../../src/utils/apiError.js'
import config from '../../../src/config/index.js'

describe('originChecker', () => {
    it('should allow request with allowed origin', (done) => {
        const origin = config.corsOrigin?.split(',')[0] || 'http://localhost:5173'

        originChecker(origin, (err, success) => {
            expect(err).to.be.null
            expect(success).to.be.true
            done()
        })
    })

    it('should allow request with no origin (like Postman)', (done) => {
        originChecker(undefined, (err, success) => {
            expect(err).to.be.null
            expect(success).to.be.true
            done()
        })
    })

    it('should block request from disallowed origin', (done) => {
        originChecker('https://unauthorized.com', (err) => {
            expect(err).to.be.instanceOf(ApiError)
            expect(err.statusCode).to.equal(403)
            done()
        })
    })
})