import { expect } from 'chai'
import sinon from 'sinon'
import cartDTO from '../../../src/dto/cart.dto.js'
import { CartService } from '../../../src/services/cart.service.js'

const dto = { asPublicCart: cartDTO.asPublicCart }

const fakeCart = {
    _id: '1',
    user: { _id: 'u1' },
    products: []
}

const publicCart = {
    id: '1',
    userId: 'u1',
    products: []
}

describe('Cart Service', () => {
    let cartDAOStub
    let cartService

    beforeEach(() => {
        sinon.restore()
        cartDAOStub = {
            getAllCarts: sinon.stub().resolves([fakeCart]),
            getCartById: sinon.stub().resolves(fakeCart),
            getCartByUserId: sinon.stub().resolves(fakeCart),
            createCart: sinon.stub().resolves(fakeCart),
            updateCart: sinon.stub().resolves(fakeCart),
            deleteCart: sinon.stub().resolves(true),
            addProductToCart: sinon.stub().resolves(fakeCart),
            removeProductFromCart: sinon.stub().resolves(fakeCart),
            updateCartProducts: sinon.stub().resolves(fakeCart),
            updateProductQuantity: sinon.stub().resolves(fakeCart),
            purchaseCart: sinon.stub().resolves(fakeCart)
        }

        sinon.stub(dto, 'asPublicCart').returns(publicCart)
        cartService = new CartService(cartDAOStub)
    })

    it('should get all carts', async () => {
        const result = await cartService.getAllCarts()
        expect(result).to.deep.equal([publicCart])
    })

    it('should get cart by ID', async () => {
        const result = await cartService.getCartById('1')
        expect(result).to.deep.equal(publicCart)
    })

    it('should get cart by user ID', async () => {
        const result = await cartService.getCartByUserId('u1')
        expect(result).to.deep.equal(publicCart)
    })

    it('should create a cart', async () => {
        const result = await cartService.createCart({})
        expect(result).to.deep.equal(publicCart)
    })

    it('should update a cart', async () => {
        const result = await cartService.updateCart('1', {})
        expect(result).to.deep.equal(publicCart)
    })

    it('should delete a cart', async () => {
        const result = await cartService.deleteCart('1')
        expect(result).to.be.true
    })

    it('should add product to cart', async () => {
        const result = await cartService.addProductToCart('1', 'p1', 2)
        expect(result).to.deep.equal(publicCart)
    })

    it('should remove product from cart', async () => {
        const result = await cartService.removeProductFromCart('1', 'p1')
        expect(result).to.deep.equal(publicCart)
    })

    it('should update cart products', async () => {
        const result = await cartService.updateCartProducts('1', [])
        expect(result).to.deep.equal(publicCart)
    })

    it('should update product quantity', async () => {
        const result = await cartService.updateProductQuantity('1', 'p1', 5)
        expect(result).to.deep.equal(publicCart)
    })

    it('should purchase cart', async () => {
        const result = await cartService.purchaseCart('1', { _id: 'u1' })
        expect(result).to.deep.equal(publicCart)
    })
})