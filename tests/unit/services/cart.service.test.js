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
        const fakeCarts = [
            {
                _id: '1',
                user: { _id: 'u1' },
                products: []
            },
            {
                _id: '2',
                user: { _id: 'u2' },
                products: []
            }
        ]

        sinon.stub(factory.CartDAO, 'getAllCarts').resolves(fakeCarts)

        const result = await CartService.getAllCarts()

        expect(result).to.deep.equal([
            {
                id: '1',
                userId: 'u1',
                products: []
            },
            {
                id: '2',
                userId: 'u2',
                products: []
            }
        ])
    })

    it('debería obtener un carrito por ID', async () => {
        const cart = {
            _id: '123',
            user: { _id: 'u123' },
            products: []
        }

        sinon.stub(factory.CartDAO, 'getCartById').resolves(cart)

        const result = await CartService.getCartById('123')

        expect(result).to.deep.equal({
            id: '123',
            userId: 'u123',
            products: []
        })
    })

    it('debería obtener un carrito por userId', async () => {
        const cart = {
            _id: 'xyz',
            user: { _id: 'abc' },
            products: []
        }

        sinon.stub(factory.CartDAO, 'getCartByUserId').resolves(cart)

        const result = await CartService.getCartByUserId('abc')

        expect(result).to.deep.equal({
            id: 'xyz',
            userId: 'abc',
            products: []
        })
    })

    it('debería crear un carrito', async () => {
        const cart = {
            _id: 'new123',
            user: { _id: 'u1' },
            products: []
        }

        sinon.stub(factory.CartDAO, 'createCart').resolves(cart)

        const result = await CartService.createCart({ user: 'u1' })

        expect(result).to.deep.equal({
            id: 'new123',
            userId: 'u1',
            products: []
        })
    })

    it('debería actualizar un carrito', async () => {
        const updatedCart = {
            _id: 'update1',
            user: { _id: 'u1' },
            products: []
        }

        sinon.stub(factory.CartDAO, 'updateCart').resolves(updatedCart)

        const result = await CartService.updateCart('update1', { products: [] })

        expect(result).to.deep.equal({
            id: 'update1',
            userId: 'u1',
            products: []
        })
    })

    it('debería eliminar un carrito', async () => {
        sinon.stub(factory.CartDAO, 'deleteCart').resolves(true)

        const result = await CartService.deleteCart('delete1')
        expect(result).to.be.true
    })

    it('debería agregar un producto al carrito', async () => {
        const updatedCart = {
            _id: 'cart1',
            user: { _id: 'u1' },
            products: [
                {
                    product: {
                        _id: 'p1',
                        title: 'Producto 1',
                        price: 100
                    },
                    quantity: 2
                }
            ]
        }

        sinon.stub(factory.CartDAO, 'addProductToCart').resolves(updatedCart)

        const result = await CartService.addProductToCart('cart1', 'p1', 2)

        expect(result).to.deep.equal({
            id: 'cart1',
            userId: 'u1',
            products: [
                {
                    productId: 'p1',
                    title: 'Producto 1',
                    price: 100,
                    quantity: 2
                }
            ]
        })
    })

    it('debería eliminar un producto del carrito', async () => {
        const updatedCart = {
            _id: 'cart1',
            user: { _id: 'u1' },
            products: [] // ya sin productos
        }

        sinon.stub(factory.CartDAO, 'removeProductFromCart').resolves(updatedCart)

        const result = await CartService.removeProductFromCart('cart1', 'p1')

        expect(result).to.deep.equal({
            id: 'cart1',
            userId: 'u1',
            products: []
        })
    })

    it('debería actualizar los productos del carrito', async () => {
        const updatedCart = {
            _id: 'cart1',
            user: { _id: 'u1' },
            products: [
                {
                    product: { _id: 'pX', title: 'Producto X', price: 100 },
                    quantity: 1
                }
            ]
        }

        sinon.stub(factory.CartDAO, 'updateCartProducts').resolves(updatedCart)

        const result = await CartService.updateCartProducts('cart1', [
            { productId: 'pX', quantity: 1 }
        ])

        expect(result).to.deep.equal({
            id: 'cart1',
            userId: 'u1',
            products: [
                {
                    productId: 'pX',
                    title: 'Producto X',
                    price: 100,
                    quantity: 1
                }
            ]
        })
    })

})