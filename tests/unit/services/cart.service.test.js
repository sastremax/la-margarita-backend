import sinon from 'sinon'
import CartService from '../../../src/services/cart.service.js'
import getFactory from '../../../src/dao/factory.js'

let factory

before(async () => {
    factory = await getFactory()
})

describe('Cart Service', () => {
    afterEach(() => {
        sinon.restore()
    })

    it('debería obtener todos los carritos', async () => {
        const fakeCarts = [{ id: '1' }, { id: '2' }]
        sinon.stub(factory.CartDAO, 'getAllCarts').resolves(fakeCarts)

        const result = await CartService.getAllCarts()
        expect(result).to.deep.equal(fakeCarts)
    })

    it('debería obtener un carrito por ID', async () => {
        const fakeCart = { id: '123' }
        sinon.stub(factory.CartDAO, 'getCartById').resolves(fakeCart)

        const result = await CartService.getCartById('123')
        expect(result).to.deep.equal(fakeCart)
    })

    it('debería obtener un carrito por userId', async () => {
        const fakeCart = { id: 'xyz', userId: 'abc' }
        sinon.stub(factory.CartDAO, 'getCartByUserId').resolves(fakeCart)

        const result = await CartService.getCartByUserId('abc')
        expect(result).to.deep.equal(fakeCart)
    })

    it('debería crear un carrito', async () => {
        const fakeCart = { id: 'new123' }
        sinon.stub(factory.CartDAO, 'createCart').resolves(fakeCart)

        const result = await CartService.createCart({})
        expect(result).to.deep.equal(fakeCart)
    })

    it('debería actualizar un carrito', async () => {
        const updatedCart = { id: 'update1', total: 10 }
        sinon.stub(factory.CartDAO, 'updateCart').resolves(updatedCart)

        const result = await CartService.updateCart('update1', { total: 10 })
        expect(result).to.deep.equal(updatedCart)
    })

    it('debería eliminar un carrito', async () => {
        sinon.stub(factory.CartDAO, 'deleteCart').resolves(true)

        const result = await CartService.deleteCart('delete1')
        expect(result).to.be.true
    })

    it('debería agregar un producto al carrito', async () => {
        const resultCart = { id: 'cart1', products: [{ product: 'p1', quantity: 2 }] }
        sinon.stub(factory.CartDAO, 'addProductToCart').resolves(resultCart)

        const result = await CartService.addProductToCart('cart1', 'p1', 2)
        expect(result).to.deep.equal(resultCart)
    })

    it('debería eliminar un producto del carrito', async () => {
        const resultCart = { id: 'cart1', products: [] }
        sinon.stub(factory.CartDAO, 'removeProductFromCart').resolves(resultCart)

        const result = await CartService.removeProductFromCart('cart1', 'p1')
        expect(result).to.deep.equal(resultCart)
    })

    it('debería actualizar los productos del carrito', async () => {
        const updatedCart = { id: 'cart1', products: [{ product: 'pX', quantity: 1 }] }
        sinon.stub(factory.CartDAO, 'updateCartProducts').resolves(updatedCart)

        const result = await CartService.updateCartProducts('cart1', [{ product: 'pX', quantity: 1 }])
        expect(result).to.deep.equal(updatedCart)
    })
})