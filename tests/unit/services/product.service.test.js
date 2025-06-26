import sinon from 'sinon'
import ProductService from '../../../src/services/product.service.js'
import ProductDAO from '../../../src/dao/product.dao.js'

describe('Product Service', () => {
    afterEach(() => {
        sinon.restore()
    })

    it('debería crear un producto', async () => {
        const data = { title: 'Producto A', price: 50 }
        const created = { id: '1', ...data }

        sinon.stub(ProductDAO, 'createProduct').resolves(created)

        const result = await ProductService.createProduct(data)
        expect(result).to.deep.equal(created)
    })

    it('debería obtener todos los productos', async () => {
        const list = [{ id: '1' }, { id: '2' }]
        sinon.stub(ProductDAO, 'getAllProducts').resolves(list)

        const result = await ProductService.getAllProducts()
        expect(result).to.deep.equal(list)
    })

    it('debería obtener un producto por ID', async () => {
        const product = { id: 'abc' }
        sinon.stub(ProductDAO, 'getProductById').resolves(product)

        const result = await ProductService.getProductById('abc')
        expect(result).to.deep.equal(product)
    })

    it('debería actualizar un producto', async () => {
        const updated = { id: 'x1', title: 'Nuevo nombre' }
        sinon.stub(ProductDAO, 'updateProduct').resolves(updated)

        const result = await ProductService.updateProduct('x1', { title: 'Nuevo nombre' })
        expect(result).to.deep.equal(updated)
    })

    it('debería eliminar un producto', async () => {
        sinon.stub(ProductDAO, 'deleteProduct').resolves(true)

        const result = await ProductService.deleteProduct('x1')
        expect(result).to.be.true
    })
})
