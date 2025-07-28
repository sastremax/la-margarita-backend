import sinon from 'sinon'
import { expect } from 'chai'
import authController from '../../../src/controllers/auth.controller.js'
import authService from '../../../src/services/auth.service.js'
import jwtUtil from '../../../src/utils/jwt.util.js'
import AuditService from '../../../src/services/audit.service.js'
import asPublicUser from '../../../src/dto/user.dto.js'

describe('auth.controller', () => {
    let req, res, next, sandbox

    beforeEach(() => {
        sandbox = sinon.createSandbox()
        req = {
            body: {},
            ip: '127.0.0.1',
            headers: { 'user-agent': 'test-agent' },
            user: { _id: 'mockUserId' }
        }
        res = {
            status: sandbox.stub().returnsThis(),
            json: sandbox.stub().returnsThis(),
            cookie: sandbox.stub().returnsThis(),
            clearCookie: sandbox.stub().returnsThis()
        }
        next = sandbox.stub()
    })

    afterEach(() => {
        sandbox.restore()
    })

    it('postLogin debería loguear y devolver usuario', async () => {
        req.body = { email: 'test@example.com', password: '123456' }
        const fakeUser = { _id: '1', role: 'user', firstName: 'A', lastName: 'B', email: 'a@b.com', cart: null }

        sandbox.stub(authService, 'loginUser').resolves(fakeUser)
        sandbox.stub(jwtUtil, 'createAccessToken').returns('token123')
        sandbox.stub(jwtUtil, 'createRefreshToken').returns('refresh123')
        sandbox.stub(AuditService, 'logEvent').resolves()

        await authController.postLogin(req, res, next)

        expect(res.cookie.calledTwice).to.be.true
        expect(res.status.calledWith(200)).to.be.true
        expect(res.json.calledOnce).to.be.true
        expect(res.json.firstCall.args[0]).to.have.property('status', 'success')
        expect(res.json.firstCall.args[0].data.user).to.have.property('id', '1')
    })

    it('postRegister debería registrar y devolver usuario', async () => {
        req.body = { firstName: 'A', lastName: 'B', email: 'a@b.com', password: 'pass' }
        const newUser = { _id: '2', firstName: 'A', lastName: 'B', email: 'a@b.com', role: 'user', cart: null }

        sandbox.stub(authService, 'registerUser').resolves(newUser)

        await authController.postRegister(req, res, next)

        expect(res.status.calledWith(201)).to.be.true
        expect(res.json.calledOnce).to.be.true
        expect(res.json.firstCall.args[0]).to.have.property('status', 'success')
        expect(res.json.firstCall.args[0].data).to.have.property('id', '2')
    })

    it('postLogout debería limpiar cookies y responder con éxito', async () => {
        sandbox.stub(AuditService, 'logEvent').resolves()

        await authController.postLogout(req, res, next)

        expect(res.clearCookie.calledWith('token')).to.be.true
        expect(res.clearCookie.calledWith('refreshToken')).to.be.true
        expect(res.status.calledWith(200)).to.be.true
        expect(res.json.calledOnce).to.be.true
        expect(AuditService.logEvent.called).to.be.true
    })
})
