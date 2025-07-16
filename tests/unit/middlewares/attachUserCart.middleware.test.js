import { expect } from 'chai'
import sinon from 'sinon'
import CartDAO from '../../../src/dao/cart.dao.js'
import ApiError from '../../../src/utils/apiError.js'
import attachUserCart from '../../../src/middlewares/attachUserCart.middleware.js'

describe('attachUserCart middleware', () => {
    let req, res, next, mockCart

    beforeEach(() => {
        req = { user: { cart: 'cart123' } }
        res = {}
        next = sinon.spy()
        mockCart = { _id: 'cart123', products: [] }
    })

    afterEach(() => {
        sinon.restore()
    })

    it('should attach cart to request if found', async () => {
        sinon.stub(CartDAO.prototype, 'getCartById').resolves(mockCart)

        await attachUserCart(req, res, next)

        expect(req.cart).to.deep.equal(mockCart)
        expect(next.calledOnce).to.be.true
    })

    it('should throw 400 if user has no cart', async () => {
        req.user = {}

        await attachUserCart(req, res, next)

        const errorArg = next.firstCall.args[0]
        expect(errorArg).to.be.instanceOf(ApiError)
        expect(errorArg.statusCode).to.equal(400)
    })

    it('should throw 404 if cart not found', async () => {
        sinon.stub(CartDAO.prototype, 'getCartById').resolves(null)

        await attachUserCart(req, res, next)

        const errorArg = next.firstCall.args[0]
        expect(errorArg).to.be.instanceOf(ApiError)
        expect(errorArg.statusCode).to.equal(404)
    })

    it('should call next with error if exception thrown', async () => {
        sinon.stub(CartDAO.prototype, 'getCartById').throws(new Error('DB error'))

        await attachUserCart(req, res, next)

        const errorArg = next.firstCall.args[0]
        expect(errorArg.message).to.equal('DB error')
    })
})