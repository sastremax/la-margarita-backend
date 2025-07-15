import { expect } from 'chai'
import sinon from 'sinon'
import ImageService from '../../../src/services/image.service.js'
import ImageDAO from '../../../src/dao/image.dao.js'
import imageDTO from '../../../src/dto/image.dto.js'

describe('Image Service', () => {
    const fakeImage = {
        _id: 'img123',
        url: 'https://example.com/image.jpg',
        name: 'image.jpg',
        associatedType: 'lodging',
        associatedId: 'lodging123',
        public_id: 'cloudinary123'
    }

    const fakePublicImage = { id: 'img123', url: fakeImage.url }

    beforeEach(() => {
        sinon.restore()
    })

    describe('getAllImages', () => {
        it('debería retornar todas las imágenes en formato público', async () => {
            sinon.stub(ImageDAO.prototype, 'getAllImages').resolves([fakeImage])
            sinon.stub(imageDTO, 'asPublicImage').callsFake((img) => ({ id: img._id, url: img.url }))

            const result = await ImageService.getAllImages()

            expect(result).to.deep.equal([fakePublicImage])
        })
    })

    describe('getImageById', () => {
        it('debería retornar una imagen por ID en formato público', async () => {
            sinon.stub(ImageDAO.prototype, 'getImageById').resolves(fakeImage)
            sinon.stub(imageDTO, 'asPublicImage').returns(fakePublicImage)

            const result = await ImageService.getImageById('img123')

            expect(result).to.deep.equal(fakePublicImage)
        })
    })

    describe('getImagesByLodgingId', () => {
        it('debería retornar imágenes asociadas a un lodging', async () => {
            sinon.stub(ImageDAO.prototype, 'getImagesByLodgingId').resolves([fakeImage])
            sinon.stub(imageDTO, 'asPublicImage').callsFake((img) => ({ id: img._id, url: img.url }))

            const result = await ImageService.getImagesByLodgingId('lodging123')

            expect(result).to.deep.equal([fakePublicImage])
        })
    })

    describe('uploadImage', () => {
        it('debería subir una imagen y devolverla en formato público', async () => {
            const imageData = {
                url: 'https://example.com/image.jpg',
                name: 'image.jpg',
                type: 'lodging',
                refId: 'lodging123',
                publicId: 'cloudinary123'
            }

            const dbImage = {
                url: imageData.url,
                name: imageData.name,
                associatedType: imageData.type,
                associatedId: imageData.refId,
                public_id: imageData.publicId
            }

            sinon.stub(ImageDAO.prototype, 'uploadImage').resolves(fakeImage)
            sinon.stub(imageDTO, 'asPublicImage').returns(fakePublicImage)

            const result = await ImageService.uploadImage(imageData)

            expect(result).to.deep.equal(fakePublicImage)
        })
    })

    describe('deleteImage', () => {
        it('debería llamar a deleteImage del DAO con el ID correcto', async () => {
            const stub = sinon.stub(ImageDAO.prototype, 'deleteImage').resolves()

            await ImageService.deleteImage('img123')

            expect(stub.calledOnceWith('img123')).to.be.true
        })
    })
})
