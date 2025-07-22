import { expect } from 'chai'
import sinon from 'sinon'
import ApiError from '../../../src/utils/apiError.js'

function buildValidateCartExists(cartService) {
    return async function validateCartExists(req, res, next) {
        try {
            const cart = await cartService.getCartById(req.params.cid)
            if (!cart) throw new ApiError(404, 'Cart not found')
            next()
        } catch (error) {
            next(error)
        }
    }
}

describe('validateCartExists.middleware (mocked)', () => {
    let req, res, next, mockService, middleware

    beforeEach(() => {
        req = { params: { cid: 'cart-123' } }
        res = {}
        next = sinon.spy()

        mockService = { getCartById: sinon.stub() }
        middleware = buildValidateCartExists(mockService)
    })

    it('should call next if cart exists', async () => {
        mockService.getCartById.resolves({ id: 'cart-123', total: 0 })

        await middleware(req, res, next)

        expect(next.calledOnce).to.be.true
        expect(next.firstCall.args.length).to.equal(0)
    })

    it('should throw 404 if cart not found', async () => {
        mockService.getCartById.resolves(null)

        await middleware(req, res, next)

        const err = next.firstCall.args[0]
        expect(err).to.be.instanceOf(ApiError)
        expect(err.statusCode).to.equal(404)
        expect(err.message).to.equal('Cart not found')
    })

    it('should pass through unexpected errors', async () => {
        const error = new Error('Unexpected DB error')
        mockService.getCartById.rejects(error)

        await middleware(req, res, next)

        const err = next.firstCall.args[0]
        expect(err).to.equal(error)
    })
})