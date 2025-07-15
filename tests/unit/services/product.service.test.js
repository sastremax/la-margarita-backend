import { expect } from 'chai'
import sinon from 'sinon'
import ProductService from '../../../src/services/product.service.js'
import ProductDAO from '../../../src/dao/product.dao.js'
import productDTO from '../../../src/dto/product.dto.js'

const dto = { asPublicProduct: productDTO.asPublicProduct }

const fakeProduct = {
    _id: '1',
    title: 'Product A',
    description: 'Description A',
    price: 100,
    code: 'P001',
    category: 'Category A',
    stock: 10,
    images: []
}

const publicProduct = {
    id: '1',
    title: 'Product A',
    description: 'Description A',
    price: 100,
    code: 'P001',
    category: 'Category A',
    stock: 10,
    images: []
}

describe('Product Service', () => {
    beforeEach(() => {
        sinon.restore()
    })

    it('should get all products', async () => {
        sinon.stub(ProductDAO.prototype, 'getAllProducts').resolves([fakeProduct])
        sinon.stub(dto, 'asPublicProduct').returns(publicProduct)

        const result = await ProductService.getAllProducts()
        expect(result).to.deep.equal([publicProduct])
    })

    it('should get product by ID', async () => {
        sinon.stub(ProductDAO.prototype, 'getProductById').resolves(fakeProduct)
        sinon.stub(dto, 'asPublicProduct').returns(publicProduct)

        const result = await ProductService.getProductById('1')
        expect(result).to.deep.equal(publicProduct)
    })

    it('should get product by code', async () => {
        sinon.stub(ProductDAO.prototype, 'getProductByCode').resolves(fakeProduct)
        sinon.stub(dto, 'asPublicProduct').returns(publicProduct)

        const result = await ProductService.getProductByCode('P001')
        expect(result).to.deep.equal(publicProduct)
    })

    it('should create product', async () => {
        sinon.stub(ProductDAO.prototype, 'createProduct').resolves(fakeProduct)
        sinon.stub(dto, 'asPublicProduct').returns(publicProduct)

        const result = await ProductService.createProduct(fakeProduct)
        expect(result).to.deep.equal(publicProduct)
    })

    it('should update product', async () => {
        sinon.stub(ProductDAO.prototype, 'updateProduct').resolves(fakeProduct)
        sinon.stub(dto, 'asPublicProduct').returns(publicProduct)

        const result = await ProductService.updateProduct('1', { title: 'Updated' })
        expect(result).to.deep.equal(publicProduct)
    })

    it('should delete product', async () => {
        sinon.stub(ProductDAO.prototype, 'deleteProduct').resolves(true)

        const result = await ProductService.deleteProduct('1')
        expect(result).to.be.true
    })
})