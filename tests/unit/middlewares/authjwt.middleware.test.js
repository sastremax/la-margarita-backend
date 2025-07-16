import { expect } from 'chai'
import sinon from 'sinon'
import authJWT from '../../../src/middlewares/authjwt.middleware.js'
import jwtUtil from '../../../src/utils/jwt.util.js'
import ApiError from '../../../src/utils/apiError.js'

describe('authjwt.middleware', () => {
    let req, res, next

    beforeEach(() => {
        req = { cookies: { token: 'token123' } }
        res = {}
        next = sinon.spy()
        sinon.stub(jwtUtil, 'verifyAccessToken')
    })

    afterEach(() => {
        sinon.restore()
    })

    it('should call next with decoded user if token is valid', () => {
        const mockUser = { id: 'abc', role: 'admin' }
        jwtUtil.verifyAccessToken.returns(mockUser)

        authJWT(req, res, next)

        expect(req.user).to.deep.equal(mockUser)
        expect(next.calledOnce).to.be.true
    })

    it('should call next with ApiError if token is missing', () => {
        req.cookies = {}
        authJWT(req, res, next)

        const err = next.firstCall.args[0]
        expect(err).to.be.instanceOf(ApiError)
        expect(err.statusCode).to.equal(401)
    })

    it('should call next with error if token is invalid or expired', () => {
        jwtUtil.verifyAccessToken.throws(new Error('token expired'))

        authJWT(req, res, next)

        const err = next.firstCall.args[0]
        expect(err.message).to.equal('token expired')
    })
})