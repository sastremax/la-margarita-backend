import { expect } from 'chai'
import sinon from 'sinon'
import ImageService from '../../../src/services/image.service.js'
import imageDTO from '../../../src/dto/image.dto.js'
import getFactory from '../../../src/dao/factory.js'

describe('Image Service', () => {
    let sandbox
    let mockDAO
    const fakeImages = [
        {
            _id: 'img1',
            url: 'http://example.com/img1.jpg',
            name: 'img1',
            associatedType: 'lodging',
            associatedId: 'lodg1',
            public_id: 'pub1',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            _id: 'img2',
            url: 'http://example.com/img2.jpg',
            name: 'img2',
            associatedType: 'lodging',
            associatedId: 'lodg1',
            public_id: null,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ]

    const fakeImageDTOs = fakeImages.map(imageDTO.asPublicImage)

    before(async () => {
        sandbox = sinon.createSandbox()
        const daos = await getFactory()
        mockDAO = daos.ImageDAO
        sandbox.stub(mockDAO, 'getAllImages').resolves(fakeImages)
        sandbox.stub(mockDAO, 'getImageById').resolves(fakeImages[0])
        sandbox.stub(mockDAO, 'getImagesByLodgingId').resolves(fakeImages)
        sandbox.stub(mockDAO, 'uploadImage').resolves(fakeImages[0])
        sandbox.stub(mockDAO, 'deleteImage').resolves(true)
    })

    after(() => {
        sandbox.restore()
    })

    describe('getAllImages', () => {
        it('debería retornar todas las imágenes con formato público', async () => {
            const result = await ImageService.getAllImages()
            expect(result).to.deep.equal(fakeImageDTOs)
        })
    })

    describe('getImageById', () => {
        it('debería retornar una imagen por ID en formato público', async () => {
            const result = await ImageService.getImageById('img1')
            expect(result).to.deep.equal(fakeImageDTOs[0])
        })
    })

    describe('getImagesByLodgingId', () => {
        it('debería retornar imágenes por lodgingId en formato público', async () => {
            const result = await ImageService.getImagesByLodgingId('lodg1')
            expect(result).to.deep.equal(fakeImageDTOs)
        })
    })

    describe('uploadImage', () => {
        it('debería subir una imagen correctamente y retornar el DTO', async () => {
            const newImage = {
                url: 'http://example.com/img1.jpg',
                name: 'img1',
                type: 'lodging',
                refId: 'lodg1',
                publicId: 'pub1'
            }

            const result = await ImageService.uploadImage(newImage)
            expect(result).to.deep.equal(fakeImageDTOs[0])
        })
    })

    describe('deleteImage', () => {
        it('debería eliminar una imagen por ID', async () => {
            const result = await ImageService.deleteImage('img1')
            expect(result).to.be.true
        })
    })
})