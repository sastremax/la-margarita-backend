import { expect } from 'chai'
import sinon from 'sinon'
import auditLogger from '../../../src/middlewares/auditLogger.js'
import logger from '../../../src/config/logger.js'

describe('auditLogger middleware', () => {
    let req, res, next

    beforeEach(() => {
        req = {
            user: { id: 'user123' },
            ip: '127.0.0.1',
            method: 'GET',
            originalUrl: '/api/test'
        }
        res = {}
        next = sinon.spy()
        sinon.stub(logger, 'info')
    })

    afterEach(() => {
        sinon.restore()
    })

    it('should log audit information and call next()', () => {
        auditLogger(req, res, next)

        expect(logger.info.calledOnce).to.be.true
        const logMessage = logger.info.firstCall.args[0]
        expect(logMessage).to.include('[AUDIT]')
        expect(logMessage).to.include('GET /api/test')
        expect(logMessage).to.include('User: user123')
        expect(logMessage).to.include('IP: 127.0.0.1')
        expect(next.calledOnce).to.be.true
    })

    it('should default to anonymous user if req.user is not defined', () => {
        req.user = undefined
        auditLogger(req, res, next)

        const logMessage = logger.info.firstCall.args[0]
        expect(logMessage).to.include('User: anonymous')
        expect(next.calledOnce).to.be.true
    })
})