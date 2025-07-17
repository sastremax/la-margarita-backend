import { expect } from 'chai'
import sinon from 'sinon'
import authorizeRoles from '../../../src/middlewares/role.middleware.js'

describe('role.middleware', () => {
    let req, res, next

    beforeEach(() => {
        req = {}
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        }
        next = sinon.spy()
    })

    it('should return 403 if no user in request', () => {
        const middleware = authorizeRoles('admin')
        middleware(req, res, next)

        expect(res.status.calledWith(403)).to.be.true
        expect(res.json.calledWith({ status: 'error', message: 'Access denied' })).to.be.true
    })

    it('should return 403 if user role is not allowed', () => {
        req.user = { role: 'user' }
        const middleware = authorizeRoles('admin')
        middleware(req, res, next)

        expect(res.status.calledWith(403)).to.be.true
        expect(res.json.calledWith({ status: 'error', message: 'Access denied' })).to.be.true
    })

    it('should call next if user has allowed role', () => {
        req.user = { role: 'admin' }
        const middleware = authorizeRoles('admin', 'superadmin')
        middleware(req, res, next)

        expect(next.calledOnce).to.be.true
    })
})