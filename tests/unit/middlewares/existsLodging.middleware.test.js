import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../../src/dao/lodging.dao.js', () => {
    const getLodgingById = vi.fn()
    return {
        LodgingDAO: vi.fn().mockImplementation(() => ({ getLodgingById })),
        __mocks: { getLodgingById }
    }
})

import { __mocks } from '../../../src/dao/lodging.dao.js'
import { existsLodging } from '../../../src/middlewares/existsLodging.middleware.js'

describe('existsLodging.middleware', () => {
    let req, res, next

    beforeEach(() => {
        vi.clearAllMocks()
        req = { params: { lid: 'l1' } }
        res = { status: vi.fn().mockReturnThis(), json: vi.fn() }
        next = vi.fn()
    })

    it('debería seguir si existe lodging', async () => {
        __mocks.getLodgingById.mockResolvedValue({ id: 'l1' })
        await existsLodging(req, res, next)
        expect(__mocks.getLodgingById).toHaveBeenCalledWith('l1')
        expect(req.lodging).toEqual({ id: 'l1' })
        expect(next).toHaveBeenCalled()
    })

    it('debería responder 404 si no existe', async () => {
        __mocks.getLodgingById.mockResolvedValue(null)
        await existsLodging(req, res, next)
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({ status: 'error', error: 'Lodging not found' })
        expect(next).not.toHaveBeenCalled()
    })
})
