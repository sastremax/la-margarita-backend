import { beforeEach, describe, expect, test, vi } from 'vitest'
import * as controller from '../../../src/controllers/lodging.controller.js'
import { LodgingService } from '../../../src/services/lodging.service.js'
import { ApiError } from '../../../src/utils/apiError.js'

vi.mock('../../../src/services/lodging.service.js', () => ({
    LodgingService: {
        getAllLodgings: vi.fn(),
        getLodgingById: vi.fn(),
        getLodgingsByOwner: vi.fn(),
        createLodging: vi.fn(),
        updateLodging: vi.fn(),
        disableLodging: vi.fn(),
        deleteLodging: vi.fn()
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

describe('lodging.controller', () => {
    test('debería listar con filtros válidos', async () => {
        const req = { query: {} }
        const res = mockRes()
        LodgingService.getAllLodgings.mockResolvedValue([{ id: 'l1' }])
        await controller.getAllLodgings(req, res, next)
        expect(LodgingService.getAllLodgings).toHaveBeenCalledWith({})
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: [{ id: 'l1' }] })
    })

    test('debería devolver 400 si filtros inválidos', async () => {
        const req = { query: { capacity: 'NaN' } }
        const res = mockRes()
        await controller.getAllLodgings(req, res, next)
        expect(next).toHaveBeenCalled()
        const err = next.mock.calls[0][0]
        expect(err).toBeInstanceOf(ApiError)
        expect(err.statusCode || err.status).toBe(400)
    })

    test('debería obtener por lid o 404 si no existe', async () => {
        const res1 = mockRes()
        LodgingService.getLodgingById.mockResolvedValueOnce(null)
        await controller.getLodgingById({ params: { lid: 'x' } }, res1, next)
        expect(next).toHaveBeenCalled()
        const err = next.mock.calls[0][0]
        expect(err).toBeInstanceOf(ApiError)
        expect(err.statusCode || err.status).toBe(404)

        const res2 = mockRes()
        LodgingService.getLodgingById.mockResolvedValueOnce({ id: 'l1' })
        await controller.getLodgingById({ params: { lid: 'l1' } }, res2, next)
        expect(res2.status).toHaveBeenCalledWith(200)
        expect(res2.json).toHaveBeenCalledWith({ status: 'success', data: { id: 'l1' } })
    })

    test('debería listar por owner', async () => {
        const req = { params: { uid: 'u1' } }
        const res = mockRes()
        LodgingService.getLodgingsByOwner.mockResolvedValue([{ id: 'l1' }])
        await controller.getLodgingsByOwner(req, res, next)
        expect(LodgingService.getLodgingsByOwner).toHaveBeenCalledWith('u1')
        expect(res.status).toHaveBeenCalledWith(200)
    })

    test('debería crear con body válido y devolver 201', async () => {
        const req = {
            user: { id: '64b0f0c0c0c0c0c0c0c0c0c0', role: 'admin' },
            body: {
                title: 'Casa',
                description: 'Desc',
                images: ['https://example.com/a.jpg'],
                location: { country: 'AR', province: 'BA', city: 'LP' },
                capacity: 6,
                pricing: { weekday: 100, weekend: 200, holiday: 300 },
                ownerId: '64b0f0c0c0c0c0c0c0c0c0c0'
            }
        }
        const res = mockRes()
        LodgingService.createLodging.mockResolvedValue({ id: 'l1' })
        await controller.createLodging(req, res, next)
        expect(LodgingService.createLodging).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: { id: 'l1' } })
    })

    test('debería rechazar update si falta auth, o si body inválido, y aceptar con 200', async () => {
        let req = { params: { lid: 'l1' }, body: { title: 'SoloTitulo' } }
        let res = mockRes()
        await controller.updateLodging(req, res, next)
        expect(next).toHaveBeenCalled()
        expect((next.mock.calls[0][0].statusCode || next.mock.calls[0][0].status)).toBe(400)

        req = {
            params: { lid: 'l1' },
            body: {
                title: 'Casa',
                description: 'Hermosa casa con parque y pileta',
                images: ['https://example.com/a.jpg'],
                location: { country: 'AR', province: 'BA', city: 'Tandil' },
                capacity: 4,
                pricing: { weekday: 100, weekend: 150 },
                ownerId: '64b0f0c0c0c0c0c0c0c0c0c0',
                isActive: true
            }
        }
        res = mockRes()
        await controller.updateLodging(req, res, next)
        expect(next).toHaveBeenCalled()
        expect((next.mock.calls[1][0].statusCode || next.mock.calls[1][0].status)).toBe(401)

        LodgingService.updateLodging.mockResolvedValueOnce(null)
        req = {
            params: { lid: 'l404' }, user: { id: 'u1' }, body: {
                title: 'Casa',
                description: 'Hermosa casa con parque y pileta',
                images: ['https://example.com/a.jpg'],
                location: { country: 'AR', province: 'BA', city: 'Tandil' },
                capacity: 4,
                pricing: { weekday: 100, weekend: 150 },
                ownerId: 'u1',
                isActive: true
            }
        }
        res = mockRes()
        await controller.updateLodging(req, res, next)
        expect(next).toHaveBeenCalled()
        expect((next.mock.calls[2][0].statusCode || next.mock.calls[2][0].status)).toBe(404)

        LodgingService.updateLodging.mockResolvedValueOnce({ id: 'l1' })
        req = {
            params: { lid: 'l1' }, user: { id: 'u1' }, body: {
                title: 'Casa',
                description: 'Hermosa casa con parque y pileta',
                images: ['https://example.com/a.jpg'],
                location: { country: 'AR', province: 'BA', city: 'Tandil' },
                capacity: 4,
                pricing: { weekday: 100, weekend: 150 },
                ownerId: 'u1',
                isActive: true
            }
        }
        res = mockRes()
        await controller.updateLodging(req, res, next)
        expect(LodgingService.updateLodging).toHaveBeenCalledWith('l1', expect.any(Object))
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: { id: 'l1' } })
    })

    test('debería deshabilitar con 200 o lanzar 404', async () => {
        const res1 = mockRes()
        LodgingService.disableLodging.mockResolvedValueOnce(null)
        await controller.disableLodging({ params: { lid: 'l404' } }, res1, next)
        expect(next).toHaveBeenCalled()
        expect((next.mock.calls[0][0].statusCode || next.mock.calls[0][0].status)).toBe(404)

        const res2 = mockRes()
        LodgingService.disableLodging.mockResolvedValueOnce({ id: 'l1', isActive: false })
        await controller.disableLodging({ params: { lid: 'l1' } }, res2, next)
        expect(res2.status).toHaveBeenCalledWith(200)
        expect(res2.json).toHaveBeenCalledWith({ status: 'success', data: { id: 'l1', isActive: false } })
    })

    test('debería borrar con 204 o lanzar 404', async () => {
        const res1 = mockRes()
        LodgingService.deleteLodging.mockResolvedValueOnce(null)
        await controller.deleteLodging({ params: { lid: 'l404' } }, res1, next)
        expect(next).toHaveBeenCalled()
        expect((next.mock.calls[0][0].statusCode || next.mock.calls[0][0].status)).toBe(404)

        const res2 = mockRes()
        LodgingService.deleteLodging.mockResolvedValueOnce(true)
        await controller.deleteLodging({ params: { lid: 'l1' } }, res2, next)
        expect(res2.status).toHaveBeenCalledWith(204)
        expect(res2.end).toHaveBeenCalled()
    })
})
