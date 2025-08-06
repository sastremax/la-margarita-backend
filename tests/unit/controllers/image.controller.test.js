import { beforeEach, describe, expect, test, vi } from 'vitest'
import * as controller from '../../../src/controllers/image.controller.js'
import { ImageService } from '../../../src/services/image.service.js'

vi.mock('../../../src/services/image.service.js')

describe('image.controller', () => {
    let req
    let res
    let next

    beforeEach(() => {
        vi.clearAllMocks()

        req = { params: {}, body: {} }
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        }
        next = vi.fn()
    })

    test('uploadImage should return 201 and image data', async () => {
        const mockImage = { id: 'img1', url: 'http://img.com' }
        ImageService.uploadImage.mockResolvedValue(mockImage)

        req.body = { url: 'http://img.com', name: 'test', type: 'lodging', refId: 'lod1' }

        await controller.uploadImage(req, res, next)

        expect(ImageService.uploadImage).toHaveBeenCalledWith(req.body)
        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: mockImage })
    })

    test('uploadImage should call next on error', async () => {
        const error = new Error('upload failed')
        ImageService.uploadImage.mockRejectedValue(error)

        await controller.uploadImage(req, res, next)

        expect(next).toHaveBeenCalledWith(error)
    })

    test('getAllImages should return 200 and image list', async () => {
        const mockImages = [{ id: 'img1' }, { id: 'img2' }]
        ImageService.getAllImages.mockResolvedValue(mockImages)

        await controller.getAllImages(req, res, next)

        expect(ImageService.getAllImages).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: mockImages })
    })

    test('getImageById should return 200 and image if found', async () => {
        const mockImage = { id: 'img123' }
        req.params.id = 'img123'
        ImageService.getImageById.mockResolvedValue(mockImage)

        await controller.getImageById(req, res, next)

        expect(ImageService.getImageById).toHaveBeenCalledWith('img123')
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: mockImage })
    })

    test('getImageById should return 404 if not found', async () => {
        req.params.id = 'notfound'
        ImageService.getImageById.mockResolvedValue(null)

        await controller.getImageById(req, res, next)

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({ status: 'error', message: 'Image not found' })
    })

    test('getImageById should call next on error', async () => {
        const error = new Error('get failed')
        ImageService.getImageById.mockRejectedValue(error)
        req.params.id = 'fail'

        await controller.getImageById(req, res, next)

        expect(next).toHaveBeenCalledWith(error)
    })

    test('getImagesByLodgingId should return 200 and image list', async () => {
        const mockImages = [{ id: 'img1' }]
        req.params.lodgingId = 'lod1'
        ImageService.getImagesByLodgingId.mockResolvedValue(mockImages)

        await controller.getImagesByLodgingId(req, res, next)

        expect(ImageService.getImagesByLodgingId).toHaveBeenCalledWith('lod1')
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: mockImages })
    })

    test('getImagesByLodgingId should call next on error', async () => {
        const error = new Error('lodging error')
        req.params.lodgingId = 'lod-fail'
        ImageService.getImagesByLodgingId.mockRejectedValue(error)

        await controller.getImagesByLodgingId(req, res, next)

        expect(next).toHaveBeenCalledWith(error)
    })

    test('deleteImage should return 200 if deleted', async () => {
        req.params.id = 'img1'
        ImageService.deleteImage.mockResolvedValue({ id: 'img1' })

        await controller.deleteImage(req, res, next)

        expect(ImageService.deleteImage).toHaveBeenCalledWith('img1')
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', message: 'Image deleted' })
    })

    test('deleteImage should return 404 if not found', async () => {
        req.params.id = 'img404'
        ImageService.deleteImage.mockResolvedValue(null)

        await controller.deleteImage(req, res, next)

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({ status: 'error', message: 'Image not found' })
    })

    test('deleteImage should call next on error', async () => {
        const error = new Error('delete failed')
        req.params.id = 'fail'
        ImageService.deleteImage.mockRejectedValue(error)

        await controller.deleteImage(req, res, next)

        expect(next).toHaveBeenCalledWith(error)
    })
})
