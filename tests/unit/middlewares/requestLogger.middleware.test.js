import { expect } from 'chai'
import sinon from 'sinon'
import requestLogger from '../../../src/middlewares/requestLogger.middleware.js'
import logger from '../../../src/config/logger.js'

describe('requestLogger.middleware', () => {
    let req, res, next, clock

    beforeEach(() => {
        req = {
            method: 'POST',
            originalUrl: '/api/data',
            ip: '192.168.0.1',
            headers: {},
            user: { email: 'user@example.com' },
            requestId: 'req-123'
        }

        res = {
            statusCode: 200,
            on: sinon.stub()
        }

        next = sinon.spy()

        sinon.stub(logger, 'info')
        sinon.stub(logger, 'error')

        clock = sinon.useFakeTimers()
    })

    afterEach(() => {
        sinon.restore()
        clock.restore()
    })

    it('should log request with info if status < 400', () => {
        let logFn
        res.on.callsFake((event, cb) => {
            if (event === 'finish') logFn = cb
        })

        requestLogger(req, res, next)

        expect(next.calledOnce).to.be.true

        clock.tick(100)
        logFn()

        expect(logger.info.calledOnce).to.be.true
        const logEntry = logger.info.firstCall.args[1]
        expect(logEntry).to.include({
            requestId: 'req-123',
            method: 'POST',
            url: '/api/data',
            statusCode: 200,
            user: 'user@example.com',
            ip: '192.168.0.1',
            durationMs: 100
        })
        expect(logEntry.timestamp).to.be.a('string')
    })

    it('should log request with error if status >= 400', () => {
        req.user = { id: 'u001' }
        res.statusCode = 404

        let logFn
        res.on.callsFake((event, cb) => {
            if (event === 'close') logFn = cb
        })

        requestLogger(req, res, next)

        clock.tick(50)
        logFn()

        expect(logger.error.calledOnce).to.be.true
        const logEntry = logger.error.firstCall.args[1]
        expect(logEntry.user).to.equal('u001')
        expect(logEntry.statusCode).to.equal(404)
    })

    it('should not log twice if finish and close are both called', () => {
        let finishCb, closeCb
        res.on.callsFake((event, cb) => {
            if (event === 'finish') finishCb = cb
            if (event === 'close') closeCb = cb
        })

        requestLogger(req, res, next)

        clock.tick(20)
        finishCb()
        closeCb()

        expect(logger.info.calledOnce).to.be.true
    })
})