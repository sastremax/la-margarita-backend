import { beforeEach, describe, expect, test, vi } from 'vitest'
import * as controller from '../../../src/controllers/image.controller.js'
import { ImageService } from '../../../src/services/image.service.js'

vi.mock('../../../src/services/image.service.js', () => ({
    ImageService: {
        getAllImages: vi.fn(),
        getImageById: vi.fn(),
        getImagesByLodgingId: vi.fn(),
        uploadImage: vi.fn(),
        deleteImage: vi.fn()
    }
}))

const mockRes = () => {
    const res = {}
    res.status = vi.fn().mockReturnValue(res)
    res.json = vi.fn().mockReturnValue(res)
    res.end = vi.fn().mockReturnValue(res)
    return res
}

const next = vi.fn()

beforeEach(() => {
    vi.clearAllMocks()
})

describe('image.controller', () => {
    test('debería subir imagen y devolver 201', async () => {
        const req = { body: { url: 'https://x/y.jpg', name: 'y', type: 'lodging', refId: 'l1' } }
        const res = mockRes()
        ImageService.uploadImage.mockResolvedValue({ id: 'i1' })
        await controller.uploadImage(req, res, next)
        expect(ImageService.uploadImage).toHaveBeenCalledWith(req.body)
        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: { id: 'i1' } })
    })

    test('debería listar imágenes con 200', async () => {
        const req = {}
        const res = mockRes()
        ImageService.getAllImages.mockResolvedValue([{ id: 'i1' }])
        await controller.getAllImages(req, res, next)
        expect(ImageService.getAllImages).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: [{ id: 'i1' }] })
    })

    test('debería obtener por id y devolver 200, o 404 si no existe', async () => {
        const res1 = mockRes()
        ImageService.getImageById.mockResolvedValueOnce(null)
        await controller.getImageById({ params: { id: 'i404' } }, res1, next)
        expect(ImageService.getImageById).toHaveBeenCalledWith('i404')
        expect(res1.status).toHaveBeenCalledWith(404)
        expect(res1.json).toHaveBeenCalledWith({ status: 'error', message: 'Image not found' })

        const res2 = mockRes()
        ImageService.getImageById.mockResolvedValueOnce({ id: 'i1' })
        await controller.getImageById({ params: { id: 'i1' } }, res2, next)
        expect(res2.status).toHaveBeenCalledWith(200)
        expect(res2.json).toHaveBeenCalledWith({ status: 'success', data: { id: 'i1' } })
    })

    test('debería obtener por lodgingId con 200', async () => {
        const req = { params: { lodgingId: 'l1' } }
        const res = mockRes()
        ImageService.getImagesByLodgingId.mockResolvedValue([{ id: 'i1' }])
        await controller.getImagesByLodgingId(req, res, next)
        expect(ImageService.getImagesByLodgingId).toHaveBeenCalledWith('l1')
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: [{ id: 'i1' }] })
    })

    test('debería borrar imagen y devolver 200, o 404 si no existe', async () => {
        const res404 = mockRes()
        ImageService.deleteImage.mockResolvedValueOnce(null)
        await controller.deleteImage({ params: { id: 'i404' } }, res404, next)
        expect(ImageService.deleteImage).toHaveBeenCalledWith('i404')
        expect(res404.status).toHaveBeenCalledWith(404)
        expect(res404.json).toHaveBeenCalledWith({ status: 'error', message: 'Image not found' })

        const resOk = mockRes()
        ImageService.deleteImage.mockResolvedValueOnce(true)
        await controller.deleteImage({ params: { id: 'i1' } }, resOk, next)
        expect(resOk.status).toHaveBeenCalledWith(200)
        expect(resOk.json).toHaveBeenCalledWith({ status: 'success', message: 'Image deleted' })
    })
})
