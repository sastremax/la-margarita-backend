import { beforeEach, describe, expect, test, vi } from 'vitest'
import { contactService } from '../../../src/services/contact.service.js'

vi.mock('../../../src/dao/factory.js', () => ({
    getFactory: vi.fn().mockResolvedValue({
        ContactDAO: {
            createContact: vi.fn().mockResolvedValue({
                _id: 'c1',
                name: 'Alice',
                email: 'alice@example.com',
                message: 'Hello, this is a test.',
                createdAt: '2025-07-30T00:00:00Z'
            }),
            getAllContacts: vi.fn().mockResolvedValue([
                {
                    _id: 'c1',
                    name: 'Alice',
                    email: 'alice@example.com',
                    message: 'Hello, this is a test.',
                    createdAt: '2025-07-30T00:00:00Z'
                }
            ]),
            getContactById: vi.fn().mockImplementation((id) =>
                id === 'c1'
                    ? {
                        _id: 'c1',
                        name: 'Alice',
                        email: 'alice@example.com',
                        message: 'Hello, this is a test.',
                        createdAt: '2025-07-30T00:00:00Z'
                    }
                    : null
            ),
            updateReplyStatus: vi.fn().mockResolvedValue({
                _id: 'c1',
                name: 'Alice',
                email: 'alice@example.com',
                message: 'Hello, this is a test.',
                createdAt: '2025-07-30T00:00:00Z'
            }),
            deleteContact: vi.fn().mockResolvedValue(true)
        }
    })
}))

describe('ContactService', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    test('createContact', async () => {
        const result = await contactService.createContact({
            name: 'Alice',
            email: 'alice@example.com',
            message: 'Hello, this is a test.'
        })

        expect(result).toEqual({
            id: 'c1',
            name: 'Alice',
            email: 'alice@example.com',
            message: 'Hello, this is a test.',
            createdAt: '2025-07-30T00:00:00Z'
        })
    })

    test('getAllContacts', async () => {
        const result = await contactService.getAllContacts()

        expect(result).toEqual([
            {
                id: 'c1',
                name: 'Alice',
                email: 'alice@example.com',
                message: 'Hello, this is a test.',
                createdAt: '2025-07-30T00:00:00Z'
            }
        ])
    })

    test('getContactById - found', async () => {
        const result = await contactService.getContactById('c1')

        expect(result).toEqual({
            id: 'c1',
            name: 'Alice',
            email: 'alice@example.com',
            message: 'Hello, this is a test.',
            createdAt: '2025-07-30T00:00:00Z'
        })
    })

    test('getContactById - not found', async () => {
        const result = await contactService.getContactById('invalid')
        expect(result).toBeNull()
    })

    test('updateReplyStatus', async () => {
        const result = await contactService.updateReplyStatus('c1', { replied: true })

        expect(result).toEqual({
            id: 'c1',
            name: 'Alice',
            email: 'alice@example.com',
            message: 'Hello, this is a test.',
            createdAt: '2025-07-30T00:00:00Z'
        })
    })

    test('deleteContact', async () => {
        const result = await contactService.deleteContact('c1')
        expect(result).toBe(true)
    })
})
