
import { expect } from 'chai'
import sinon from 'sinon'
import validateRequest, { _setValidator } from '../../../src/middlewares/validateRequest.middleware.js'

describe('validateRequest.middleware', () => {
    let req, res, next

    beforeEach(() => {
        req = {}
        res = {}
        next = sinon.stub()
    })

    afterEach(() => {
        _setValidator(null)
    })

    it('debería llamar a next si no hay errores', () => {
        _setValidator(() => ({ isEmpty: () => true }))

        validateRequest(req, res, next)

        expect(next.calledOnce).to.be.true
    })

    it('debería llamar a next con ApiError si hay errores', () => {
        const mockErrors = [{ msg: 'Invalid' }]
        _setValidator(() => ({
            isEmpty: () => false,
            array: () => mockErrors
        }))

        validateRequest(req, res, next)

        const err = next.firstCall.args[0]
        expect(err.statusCode).to.equal(400)
        expect(err.message).to.equal(JSON.stringify(mockErrors))
    })
})
