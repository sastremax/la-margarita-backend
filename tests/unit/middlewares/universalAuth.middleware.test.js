import { expect } from 'chai'
import sinon from 'sinon'
import universalAuth from '../../../src/middlewares/universalAuth.middleware.js'
import jwtUtil from '../../../src/utils/jwt.util.js'
import ApiError from '../../../src/utils/apiError.js'

describe('universalAuth.middleware', () => {
    let req, res, next

    beforeEach(() => {
        req = {
            cookies: {},
            headers: {}
        }
        res = {}
        next = sinon.spy()

        sinon.stub(jwtUtil, 'verifyAccessToken')
    })

    afterEach(() => {
        sinon.restore()
    })

    it('should return 401 if no token is provided', () => {
        universalAuth(req, res, next)

        const err = next.firstCall.args[0]
        expect(err).to.be.instanceOf(ApiError)
        expect(err.statusCode).to.equal(401)
        expect(err.message).to.equal('Authentication token missing')
    })

    it('should return 401 if token is invalid', () => {
        req.cookies.token = 'invalid-token'
        jwtUtil.verifyAccessToken.returns(null)

        universalAuth(req, res, next)

        const err = next.firstCall.args[0]
        expect(err).to.be.instanceOf(ApiError)
        expect(err.statusCode).to.equal(401)
        expect(err.message).to.equal('Invalid or expired token')
    })

    it('should decode token and call next if valid', () => {
        req.cookies.token = 'valid-token'
        const decoded = { id: 'user123', role: 'admin' }
        jwtUtil.verifyAccessToken.returns(decoded)

        universalAuth(req, res, next)

        expect(req.user).to.deep.equal(decoded)
        expect(next.calledOnce).to.be.true
        expect(next.firstCall.args.length).to.equal(0)
    })

    it('should extract token from Authorization header if not in cookies', () => {
        req.headers.authorization = 'Bearer abc.def.ghi'
        const decoded = { id: 'abc', role: 'user' }
        jwtUtil.verifyAccessToken.returns(decoded)

        universalAuth(req, res, next)

        expect(req.user).to.deep.equal(decoded)
        expect(next.calledOnce).to.be.true
    })
})