import { beforeEach, describe, expect, test, vi } from 'vitest'
import { TicketDAO } from '../../../src/dao/ticket.dao.js'
import TicketModel from '../../../src/models/ticket.model.js'

vi.mock('../../../src/models/ticket.model.js', () => ({
    default: {
        create: vi.fn(),
        findOne: vi.fn(),
        find: vi.fn(),
        countDocuments: vi.fn()
    }
}))

const thenableChain = (result) => {
    const chain = {
        sort: vi.fn(),
        skip: vi.fn(),
        limit: vi.fn(),
        lean: vi.fn()
    }
    chain.sort.mockReturnValue(chain)
    chain.skip.mockReturnValue(chain)
    chain.limit.mockReturnValue(chain)
    chain.lean.mockReturnValue(Promise.resolve(result))
    return chain
}

describe('TicketDAO', () => {
    let dao

    beforeEach(() => {
        vi.clearAllMocks()
        dao = new TicketDAO()
    })

    test('createTicket should create a ticket with valid payload', async () => {
        const payload = {
            purchaser: 'buyer@example.com',
            amount: 150,
            products: [
                { product: { _id: 'p1', title: 'X', price: 50 }, quantity: 1 },
                { product: { _id: 'p2', title: 'Y', price: 100 }, quantity: 1 }
            ]
        }
        const created = { _id: 't1', ...payload }
        TicketModel.create.mockResolvedValue(created)
        const result = await dao.createTicket(payload)
        expect(result).toEqual(created)
        expect(TicketModel.create).toHaveBeenCalledWith(payload)
    })

    test('createTicket should reject invalid purchaser', async () => {
        await expect(
            dao.createTicket({ purchaser: '', amount: 10, products: [{ product: {}, quantity: 1 }] })
        ).rejects.toThrow('Invalid purchaser')
    })

    test('createTicket should reject invalid amount', async () => {
        await expect(
            dao.createTicket({ purchaser: 'a@b.com', amount: -1, products: [{ product: {}, quantity: 1 }] })
        ).rejects.toThrow('Invalid amount')
    })

    test('createTicket should reject empty products', async () => {
        await expect(
            dao.createTicket({ purchaser: 'a@b.com', amount: 10, products: [] })
        ).rejects.toThrow('Invalid products')
    })

    test('createTicket should reject invalid product entry', async () => {
        await expect(
            dao.createTicket({ purchaser: 'a@b.com', amount: 10, products: [null] })
        ).rejects.toThrow('Invalid product entry')
    })

    test('createTicket should reject invalid product quantity', async () => {
        await expect(
            dao.createTicket({ purchaser: 'a@b.com', amount: 10, products: [{ product: {}, quantity: 0 }] })
        ).rejects.toThrow('Invalid product quantity')
    })

    test('getTicketByCode should return ticket', async () => {
        const data = { _id: 't1', code: 'abc', purchaser: 'buyer@example.com' }
        TicketModel.findOne.mockReturnValue(thenableChain(data))
        const result = await dao.getTicketByCode('abc')
        expect(result).toEqual(data)
        expect(TicketModel.findOne).toHaveBeenCalledWith({ code: 'abc' })
    })

    test('getTicketByCode should reject invalid code', async () => {
        await expect(dao.getTicketByCode('')).rejects.toThrow('Invalid code')
    })

    test('getAllTickets should return array without pagination', async () => {
        const rows = [{ _id: 't1' }, { _id: 't2' }]
        TicketModel.find.mockReturnValue(thenableChain(rows))
        const result = await dao.getAllTickets()
        expect(Array.isArray(result)).toBe(true)
        expect(result).toEqual(rows)
    })

    test('getAllTickets should return paginated object', async () => {
        const rows = [{ _id: 't1' }]
        TicketModel.countDocuments.mockResolvedValue(7)
        TicketModel.find.mockReturnValue(thenableChain(rows))
        const result = await dao.getAllTickets({ page: 2, limit: 3 })
        expect(result.total).toBe(7)
        expect(result.page).toBe(2)
        expect(result.pages).toBe(3)
        expect(result.data).toEqual(rows)
    })

    test('getTicketsByPurchaser should return array without pagination', async () => {
        const rows = [{ _id: 't1' }]
        TicketModel.find.mockReturnValue(thenableChain(rows))
        const result = await dao.getTicketsByPurchaser('buyer@example.com')
        expect(Array.isArray(result)).toBe(true)
        expect(result).toEqual(rows)
    })

    test('getTicketsByPurchaser should return paginated object', async () => {
        const rows = [{ _id: 't1' }, { _id: 't2' }]
        TicketModel.countDocuments.mockResolvedValue(5)
        TicketModel.find.mockReturnValue(thenableChain(rows))
        const result = await dao.getTicketsByPurchaser('buyer@example.com', { page: 1, limit: 2 })
        expect(result.total).toBe(5)
        expect(result.page).toBe(1)
        expect(result.pages).toBe(3)
        expect(result.data).toEqual(rows)
    })

    test('getTicketsByPurchaser should reject invalid purchaser email', async () => {
        await expect(dao.getTicketsByPurchaser('')).rejects.toThrow('Invalid purchaser email')
    })
})
