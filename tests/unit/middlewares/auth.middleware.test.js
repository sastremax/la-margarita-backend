import { expect } from 'chai'
import sinon from 'sinon'
import authMiddleware from '../../../src/middlewares/auth.middleware.js'
import jwtUtil from '../../../src/utils/jwt.util.js'
import ApiError from '../../../src/utils/apiError.js'

describe('auth.middleware', () => {
    let req, res, next

    beforeEach(() => {
        req = { headers: { authorization: 'Bearer token123' } }
        res = {}
        next = sinon.spy()
        sinon.stub(jwtUtil, 'verifyAccessToken')
    })

    afterEach(() => {
        sinon.restore()
    })

    it('should call next with decoded user if token is valid', () => {
        const mockUser = { id: 'abc', role: 'user' }
        jwtUtil.verifyAccessToken.returns(mockUser)

        authMiddleware(req, res, next)

        expect(req.user).to.deep.equal(mockUser)
        expect(next.calledOnce).to.be.true
    })

    it('should call next with ApiError if no token provided', () => {
        req.headers.authorization = ''
        authMiddleware(req, res, next)

        const err = next.firstCall.args[0]
        expect(err).to.be.instanceOf(ApiError)
        expect(err.statusCode).to.equal(401)
    })

    it('should call next with error if token invalid or expired', () => {
        jwtUtil.verifyAccessToken.throws(new Error('invalid token'))
        authMiddleware(req, res, next)

        const err = next.firstCall.args[0]
        expect(err.message).to.equal('invalid token')
    })
})