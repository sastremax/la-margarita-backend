import { expect } from 'chai'
import sinon from 'sinon'
import errorHandler from '../../../src/middlewares/errorHandler.middleware.js'
import logger from '../../../src/config/logger.js'

describe('errorHandler.middleware', () => {
    let req, res, next

    beforeEach(() => {
        req = {
            method: 'GET',
            originalUrl: '/api/test',
            ip: '127.0.0.1',
            requestId: 'req-123'
        }

        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        }

        sinon.stub(logger, 'error')
    })

    afterEach(() => {
        sinon.restore()
    })

    it('should return custom error status and message', () => {
        const error = {
            statusCode: 401,
            message: 'Unauthorized'
        }

        errorHandler(error, req, res, next)

        expect(res.status.calledWith(401)).to.be.true
        expect(res.json.calledOnce).to.be.true
        expect(res.json.firstCall.args[0]).to.deep.include({
            status: 'error',
            message: 'Unauthorized'
        })
        expect(logger.error.calledOnce).to.be.true
    })

    it('should fallback to 500 and default message if not provided', () => {
        const error = {}

        errorHandler(error, req, res, next)

        expect(res.status.calledWith(500)).to.be.true
        expect(res.json.firstCall.args[0]).to.deep.include({
            status: 'error',
            message: 'Internal server error'
        })
    })

    it('should include stack trace in development mode', () => {
        process.env.NODE_ENV = 'development'

        const error = {
            statusCode: 500,
            message: 'Something went wrong',
            stack: 'mock-stack-trace'
        }

        errorHandler(error, req, res, next)

        const response = res.json.firstCall.args[0]
        expect(response.stack).to.equal('mock-stack-trace')
    })

    it('should exclude stack trace outside development mode', () => {
        process.env.NODE_ENV = 'production'

        const error = {
            statusCode: 500,
            message: 'Error prod',
            stack: 'should-not-appear'
        }

        errorHandler(error, req, res, next)

        const response = res.json.firstCall.args[0]
        expect(response.stack).to.be.undefined
    })
})