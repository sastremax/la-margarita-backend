import { beforeEach, describe, expect, test, vi } from 'vitest'

vi.mock('../../../src/models/image.model.js', async () => {
    return {
        default: {
            find: vi.fn(),
            findById: vi.fn(),
            findByIdAndDelete: vi.fn(),
            create: vi.fn()
        }
    }
})

let ImageModel
let ImageDAO
let imageDAO

beforeEach(async () => {
    vi.clearAllMocks()

    ImageModel = (await import('../../../src/models/image.model.js')).default
        ; ({ ImageDAO } = await import('../../../src/dao/image.dao.js'))
    imageDAO = new ImageDAO()
})

describe('ImageDAO', () => {
    test('getAllImages should call find()', async () => {
        ImageModel.find.mockResolvedValue([])
        const result = await imageDAO.getAllImages()
        expect(ImageModel.find).toHaveBeenCalled()
        expect(result).toEqual([])
    })

    test('getImageById should call findById with correct ID', async () => {
        const id = '123'
        ImageModel.findById.mockResolvedValue({ _id: id })
        const result = await imageDAO.getImageById(id)
        expect(ImageModel.findById).toHaveBeenCalledWith(id)
        expect(result._id).toBe(id)
    })

    test('getImagesByLodgingId should filter by associatedId and associatedType', async () => {
        const lodgingId = 'abc123'
        const expectedQuery = { associatedId: lodgingId, associatedType: 'lodging' }
        ImageModel.find.mockResolvedValue([{ _id: '1' }])
        const result = await imageDAO.getImagesByLodgingId(lodgingId)
        expect(ImageModel.find).toHaveBeenCalledWith(expectedQuery)
        expect(result.length).toBe(1)
    })

    test('uploadImage should call create with imageData', async () => {
        const imageData = { url: 'http://test.com/img.jpg' }
        ImageModel.create.mockResolvedValue(imageData)
        const result = await imageDAO.uploadImage(imageData)
        expect(ImageModel.create).toHaveBeenCalledWith(imageData)
        expect(result).toEqual(imageData)
    })

    test('deleteImage should call findByIdAndDelete with correct ID', async () => {
        const id = 'del123'
        ImageModel.findByIdAndDelete.mockResolvedValue({ _id: id })
        const result = await imageDAO.deleteImage(id)
        expect(ImageModel.findByIdAndDelete).toHaveBeenCalledWith(id)
        expect(result._id).toBe(id)
    })
})
