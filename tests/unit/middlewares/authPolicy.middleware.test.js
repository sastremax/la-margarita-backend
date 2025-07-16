import { expect } from 'chai'
import sinon from 'sinon'
import authPolicy from '../../../src/middlewares/authPolicy.middleware.js'
import ApiError from '../../../src/utils/apiError.js'

describe('authPolicy.middleware - role enforcement', () => {
    let req, res, next, middleware

    beforeEach(() => {
        res = {}
        next = sinon.spy()
    })

    it('should allow access if user is authenticated and has allowed role', () => {
        req = { user: { role: 'admin' } }
        middleware = authPolicy(['admin'])[1]

        middleware(req, res, next)

        expect(next.calledOnce).to.be.true
        expect(next.firstCall.args).to.be.empty
    })

    it('should deny access if user has no allowed role', () => {
        req = { user: { role: 'user' } }
        middleware = authPolicy(['admin'])[1]

        middleware(req, res, next)

        const err = next.firstCall.args[0]
        expect(err).to.be.instanceOf(ApiError)
        expect(err.statusCode).to.equal(403)
    })

    it('should deny access if user is not present in request', () => {
        req = {}
        middleware = authPolicy(['admin'])[1]

        middleware(req, res, next)

        const err = next.firstCall.args[0]
        expect(err).to.be.instanceOf(ApiError)
        expect(err.statusCode).to.equal(401)
    })

    it('should allow access if roles is empty and user is authenticated', () => {
        req = { user: { role: 'guest' } }
        middleware = authPolicy()[1]

        middleware(req, res, next)

        expect(next.calledOnce).to.be.true
        expect(next.firstCall.args).to.be.empty
    })
})