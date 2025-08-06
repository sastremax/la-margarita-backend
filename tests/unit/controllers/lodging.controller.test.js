import { beforeEach, describe, expect, test, vi } from 'vitest'
import { ApiError } from '../../../src/utils/apiError.js'
import * as lodgingController from '../../../src/controllers/lodging.controller.js'
import { LodgingService } from '../../../src/services/lodging.service.js'
import { AuditService } from '../../../src/services/audit.service.js'

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
    test('getAllLodgings - should return list of lodgings', async () => {
        const req = { query: {} }
        const res = mockRes()
        vi.spyOn(LodgingService, 'getAllLodgings').mockResolvedValue(['l1', 'l2'])

        await lodgingController.getAllLodgings(req, res, next)

        expect(LodgingService.getAllLodgings).toHaveBeenCalledWith({})
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: ['l1', 'l2'] })
    })

    test('getLodgingById - should return lodging if found', async () => {
        const req = { params: { lid: '123' } }
        const res = mockRes()
        vi.spyOn(LodgingService, 'getLodgingById').mockResolvedValue('mockLodging')

        await lodgingController.getLodgingById(req, res, next)

        expect(LodgingService.getLodgingById).toHaveBeenCalledWith('123')
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: 'mockLodging' })
    })

    test('getLodgingById - should throw 404 if not found', async () => {
        const req = { params: { lid: '123' } }
        const res = mockRes()
        vi.spyOn(LodgingService, 'getLodgingById').mockResolvedValue(null)

        await lodgingController.getLodgingById(req, res, next)

        expect(next).toHaveBeenCalledWith(new ApiError(404, 'Lodging not found'))
    })

    test('createLodging - should create lodging and return it', async () => {
        const req = {
            body: {
                title: 'New',
                description: 'Test',
                location: { city: 'X', province: 'Y', country: 'Z' },
                capacity: 1,
                pricing: { day: 100 }
            }
        }
        const res = mockRes()
        vi.spyOn(LodgingService, 'createLodging').mockResolvedValue('created')

        await lodgingController.createLodging(req, res, next)

        expect(LodgingService.createLodging).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: 'created' })
    })

    test('updateLodging - should update lodging and log event', async () => {
        const req = {
            params: { lid: '123' },
            body: { title: 'Updated' },
            user: { _id: 'user123' },
            ip: '1.2.3.4',
            headers: { 'user-agent': 'agent' }
        }
        const res = mockRes()
        vi.spyOn(LodgingService, 'updateLodging').mockResolvedValue('updated')
        vi.spyOn(AuditService, 'logEvent').mockResolvedValue()

        await lodgingController.updateLodging(req, res, next)

        expect(LodgingService.updateLodging).toHaveBeenCalledWith('123', { title: 'Updated' })
        expect(AuditService.logEvent).toHaveBeenCalledWith({
            userId: 'user123',
            event: 'update_lodging',
            success: true,
            ip: '1.2.3.4',
            userAgent: 'agent'
        })
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: 'updated' })
    })

    test('updateLodging - should throw 404 if not found', async () => {
        const req = {
            params: { lid: '123' },
            body: {},
            user: { _id: 'user123' },
            ip: '',
            headers: {}
        }
        const res = mockRes()
        vi.spyOn(LodgingService, 'updateLodging').mockResolvedValue(null)

        await lodgingController.updateLodging(req, res, next)

        expect(next).toHaveBeenCalledWith(new ApiError(404, 'Lodging not found'))
    })

    test('disableLodging - should disable lodging and return it', async () => {
        const req = { params: { lid: '123' } }
        const res = mockRes()
        vi.spyOn(LodgingService, 'disableLodging').mockResolvedValue('disabled')

        await lodgingController.disableLodging(req, res, next)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: 'disabled' })
    })

    test('disableLodging - should throw 404 if not found', async () => {
        const req = { params: { lid: '123' } }
        const res = mockRes()
        vi.spyOn(LodgingService, 'disableLodging').mockResolvedValue(null)

        await lodgingController.disableLodging(req, res, next)

        expect(next).toHaveBeenCalledWith(new ApiError(404, 'Lodging not found'))
    })

    test('deleteLodging - should delete lodging and return 204', async () => {
        const req = { params: { lid: '123' } }
        const res = mockRes()
        vi.spyOn(LodgingService, 'deleteLodging').mockResolvedValue(true)

        await lodgingController.deleteLodging(req, res, next)

        expect(LodgingService.deleteLodging).toHaveBeenCalledWith('123')
        expect(res.status).toHaveBeenCalledWith(204)
        expect(res.end).toHaveBeenCalled()
    })

    test('deleteLodging - should throw 404 if not found', async () => {
        const req = { params: { lid: '123' } }
        const res = mockRes()
        vi.spyOn(LodgingService, 'deleteLodging').mockResolvedValue(null)

        await lodgingController.deleteLodging(req, res, next)

        expect(next).toHaveBeenCalledWith(new ApiError(404, 'Lodging not found'))
    })
})
