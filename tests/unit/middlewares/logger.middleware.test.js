import { expect } from 'chai'
import sinon from 'sinon'
import loggerMiddleware from '../../../src/middlewares/logger.middleware.js'
import logger from '../../../src/config/logger.js'

describe('logger.middleware', () => {
    let req, res, next, clock

    beforeEach(() => {
        req = {
            method: 'GET',
            originalUrl: '/api/test',
            ip: '127.0.0.1',
            headers: {
                'user-agent': 'MockAgent',
                referer: 'http://localhost'
            },
            user: { email: 'test@example.com' }
        }

        res = {
            statusCode: 200,
            on: sinon.stub()
        }

        next = sinon.spy()

        sinon.stub(logger, 'info')
        sinon.stub(logger, 'warn')
        sinon.stub(logger, 'error')

        clock = sinon.useFakeTimers()
    })

    afterEach(() => {
        sinon.restore()
        clock.restore()
    })

    it('should assign requestId and call logger.info on finish', () => {
        let finishCallback
        res.on.callsFake((event, cb) => {
            if (event === 'finish') finishCallback = cb
        })

        loggerMiddleware(req, res, next)

        expect(req.requestId).to.be.a('string')
        expect(next.calledOnce).to.be.true

        clock.tick(50)
        finishCallback()

        expect(logger.info.calledOnce).to.be.true
        const logArgs = logger.info.firstCall.args[1]
        expect(logArgs).to.include({
            method: 'GET',
            url: '/api/test',
            statusCode: 200,
            user: 'test@example.com',
            ip: '127.0.0.1',
            durationMs: 50,
            userAgent: 'MockAgent',
            referer: 'http://localhost'
        })
        expect(logArgs.requestId).to.be.a('string')
    })

    it('should call logger.warn for status 400+', () => {
        res.statusCode = 404
        let finishCallback
        res.on.callsFake((event, cb) => {
            if (event === 'finish') finishCallback = cb
        })

        loggerMiddleware(req, res, next)
        clock.tick(30)
        finishCallback()

        expect(logger.warn.calledOnce).to.be.true
    })

    it('should call logger.error for status 500+', () => {
        res.statusCode = 500
        let finishCallback
        res.on.callsFake((event, cb) => {
            if (event === 'finish') finishCallback = cb
        })

        loggerMiddleware(req, res, next)
        clock.tick(20)
        finishCallback()

        expect(logger.error.called).to.be.true
        expect(logger.error.firstCall.args[0]).to.equal('[AUDIT]')
    })
})