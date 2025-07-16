import { expect } from 'chai'
import sinon from 'sinon'
import rateLimitHandler from '../../../src/middlewares/rateLimitHandler.js'
import logger from '../../../src/config/logger.js'

describe('rateLimitHandler', () => {
    let req, res, next, options

    beforeEach(() => {
        req = {
            requestId: 'mock-id',
            ip: '127.0.0.1',
            originalUrl: '/api/test'
        }

        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        }

        next = sinon.spy()

        options = {
            statusCode: 429,
            message: {
                status: 'error',
                message: 'Too many requests, please try again later.'
            }
        }

        sinon.stub(logger, 'warn')
    })

    afterEach(() => {
        sinon.restore()
    })

    it('should log warning and respond with rate limit message', () => {
        rateLimitHandler(req, res, next, options)

        expect(logger.warn.calledOnce).to.be.true
        const logMessage = logger.warn.firstCall.args[0]
        expect(logMessage).to.include('Rate limit exceeded for IP 127.0.0.1')
        expect(logMessage).to.include('mock-id')

        expect(res.status.calledWith(429)).to.be.true
        expect(res.json.calledWith(options.message)).to.be.true
    })
})