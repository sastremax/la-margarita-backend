import { describe, test, expect, vi, beforeEach } from 'vitest'
import { LodgingService } from '../../../src/services/lodging.service.js'

const mockDAO = {
    getAllLodgings: vi.fn(),
    getLodgingById: vi.fn(),
    getLodgingsByOwner: vi.fn(),
    createLodging: vi.fn(),
    updateLodging: vi.fn(),
    disableLodging: vi.fn(),
    deleteLodging: vi.fn()
}

vi.mock('../../../src/dao/factory.js', () => ({
    getFactory: async () => ({ LodgingDAO: mockDAO })
}))

vi.mock('../../../src/dto/lodging.dto.js', () => ({
    asPublicLodging: (lodging) => ({
        id: lodging._id || 'id',
        name: lodging.name,
        location: lodging.location,
        price: lodging.price
    })
}))

describe('LodgingService', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    test('getAllLodgings should return mapped lodgings', async () => {
        mockDAO.getAllLodgings.mockResolvedValue([{ _id: '1', name: 'L1' }])
        const result = await LodgingService.getAllLodgings()
        expect(result).toHaveLength(1)
        expect(result[0].name).toBe('L1')
    })

    test('getLodgingById should return a lodging', async () => {
        mockDAO.getLodgingById.mockResolvedValue({ _id: 'abc', name: 'Lodge' })
        const result = await LodgingService.getLodgingById('abc')
        expect(result.id).toBe('abc')
    })

    test('getLodgingsByOwner should return owned lodgings', async () => {
        mockDAO.getLodgingsByOwner.mockResolvedValue([{ _id: '9', name: 'LodgeX' }])
        const result = await LodgingService.getLodgingsByOwner('owner123')
        expect(result).toHaveLength(1)
        expect(result[0].name).toBe('LodgeX')
    })

    test('createLodging should return created lodging', async () => {
        mockDAO.createLodging.mockResolvedValue({ _id: 'c1', name: 'NewLodge' })
        const result = await LodgingService.createLodging({ name: 'NewLodge' })
        expect(result.name).toBe('NewLodge')
    })

    test('updateLodging should return updated lodging', async () => {
        mockDAO.updateLodging.mockResolvedValue({ _id: 'u1', name: 'UpdatedLodge' })
        const result = await LodgingService.updateLodging('u1', { name: 'UpdatedLodge' })
        expect(result.name).toBe('UpdatedLodge')
    })

    test('disableLodging should return disabled lodging', async () => {
        mockDAO.disableLodging.mockResolvedValue({ _id: 'd1', name: 'DisabledLodge' })
        const result = await LodgingService.disableLodging('d1')
        expect(result.name).toBe('DisabledLodge')
    })

    test('deleteLodging should return result of DAO delete', async () => {
        mockDAO.deleteLodging.mockResolvedValue({ deletedCount: 1 })
        const result = await LodgingService.deleteLodging('del123')
        expect(result).toEqual({ deletedCount: 1 })
    })
})
