
import { expect } from 'chai'
import sinon from 'sinon'
import verifyOwnership from '../../../src/middlewares/verifyOwnership.js'
import ApiError from '../../../src/utils/apiError.js'

describe('verifyOwnership.middleware', () => {
    let req, res, next

    beforeEach(() => {
        res = {}
        next = sinon.stub()
    })

    afterEach(() => {
        sinon.restore()
    })

    it('debería llamar a next si el usuario es el propietario', async () => {
        req = { user: { id: '123' } }
        const getOwner = sinon.stub().resolves('123')

        const middleware = verifyOwnership(getOwner)
        await middleware(req, res, next)

        expect(getOwner.calledOnceWithExactly(req)).to.be.true
        expect(next.calledOnceWithExactly()).to.be.true
    })

    it('debería lanzar error 403 si no coinciden los IDs', async () => {
        req = { user: { id: '123' } }
        const getOwner = sinon.stub().resolves('456')

        const middleware = verifyOwnership(getOwner)
        await middleware(req, res, next)

        const err = next.firstCall.args[0]
        expect(err).to.be.instanceOf(ApiError)
        expect(err.statusCode).to.equal(403)
        expect(err.message).to.equal('Access denied: You do not own this resource')
    })

    it('debería lanzar error 403 si falta requesterId', async () => {
        req = {}
        const getOwner = sinon.stub().resolves('123')

        const middleware = verifyOwnership(getOwner)
        await middleware(req, res, next)

        const err = next.firstCall.args[0]
        expect(err).to.be.instanceOf(ApiError)
        expect(err.statusCode).to.equal(403)
    })

    it('debería lanzar error 403 si falta resourceOwnerId', async () => {
        req = { user: { id: '123' } }
        const getOwner = sinon.stub().resolves(null)

        const middleware = verifyOwnership(getOwner)
        await middleware(req, res, next)

        const err = next.firstCall.args[0]
        expect(err).to.be.instanceOf(ApiError)
        expect(err.statusCode).to.equal(403)
    })

    it('debería capturar y propagar errores inesperados', async () => {
        req = { user: { id: '123' } }
        const getOwner = sinon.stub().throws(new Error('Unexpected'))

        const middleware = verifyOwnership(getOwner)
        await middleware(req, res, next)

        const err = next.firstCall.args[0]
        expect(err).to.be.instanceOf(Error)
        expect(err.message).to.equal('Unexpected')
    })
})
