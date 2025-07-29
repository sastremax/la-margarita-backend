import { describe, test, expect, vi, beforeEach } from 'vitest'
import { ImageService } from '../../../src/services/image.service.js'

const mockDAO = {
    getAllImages: vi.fn(),
    getImageById: vi.fn(),
    getImagesByLodgingId: vi.fn(),
    uploadImage: vi.fn(),
    deleteImage: vi.fn()
}

vi.mock('../../../src/dao/factory.js', () => ({
    getFactory: async () => ({ ImageDAO: mockDAO })
}))

vi.mock('../../../src/dto/image.dto.js', async () => {
    const actual = await vi.importActual('../../../src/dto/image.dto.js')
    return {
        ...actual,
        asPublicImage: (img) => ({
            id: img._id || 'id',
            url: img.url,
            name: img.name,
            type: img.associatedType,
            refId: img.associatedId,
            publicId: img.public_id
        })
    }
})

describe('ImageService', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    test('getAllImages should return array of public images', async () => {
        mockDAO.getAllImages.mockResolvedValue([{ _id: '1', url: 'img1' }, { _id: '2', url: 'img2' }])
        const result = await ImageService.getAllImages()
        expect(result).toHaveLength(2)
        expect(result[0].url).toBe('img1')
    })

    test('getImageById should return public image', async () => {
        mockDAO.getImageById.mockResolvedValue({ _id: '123', url: 'image.jpg' })
        const result = await ImageService.getImageById('123')
        expect(result.id).toBe('123')
        expect(result.url).toBe('image.jpg')
    })

    test('getImagesByLodgingId should return array of images', async () => {
        mockDAO.getImagesByLodgingId.mockResolvedValue([{ _id: '1', url: 'imgA' }])
        const result = await ImageService.getImagesByLodgingId('lodging1')
        expect(result).toHaveLength(1)
        expect(result[0].url).toBe('imgA')
    })

    test('uploadImage should validate and return public image', async () => {
        const image = {
            url: 'http://img.jpg',
            name: 'Image',
            type: 'lodging',
            refId: '123',
            publicId: 'cloud123'
        }

        mockDAO.uploadImage.mockResolvedValue({
            _id: '999',
            ...image,
            associatedType: image.type,
            associatedId: image.refId,
            public_id: image.publicId
        })

        const result = await ImageService.uploadImage(image)
        expect(result.url).toBe('http://img.jpg')
        expect(result.publicId).toBe('cloud123')
    })

    test('deleteImage should return DAO result', async () => {
        mockDAO.deleteImage.mockResolvedValue({ acknowledged: true })
        const result = await ImageService.deleteImage('id123')
        expect(result).toEqual({ acknowledged: true })
    })
})
