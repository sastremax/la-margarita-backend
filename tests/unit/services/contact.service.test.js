import { describe, test, expect, vi, beforeEach } from 'vitest'
import { ContactService } from '../../../src/services/contact.service.js'
import { contactDTO } from '../../../src/dto/contact.dto.js'

vi.mock('../../../src/dao/factory.js', () => ({
    getFactory: vi.fn().mockResolvedValue({
        ContactDAO: {
            createContact: vi.fn().mockResolvedValue({ _id: 'c1', name: 'Alice' }),
            getAllContacts: vi.fn().mockResolvedValue([{ _id: 'c1', name: 'Alice' }]),
            getContactById: vi.fn().mockImplementation(id => id === 'c1' ? { _id: 'c1', name: 'Alice' } : null),
            updateReplyStatus: vi.fn().mockResolvedValue({ _id: 'c1', name: 'Alice', replied: true }),
            deleteContact: vi.fn().mockResolvedValue(true)
        }
    })
}))

vi.mock('../../../src/dto/contact.dto.js', async () => {
    const actual = await vi.importActual('../../../src/dto/contact.dto.js')
    return {
        contactDTO: {
            ...actual.contactDTO,
            asPublicContact: vi.fn((contact) => ({
                id: contact._id,
                name: contact.name,
                replied: contact.replied || false
            }))
        }
    }
})

describe('ContactService', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    test('createContact', async () => {
        const contact = await ContactService.createContact({ name: 'Alice' })
        expect(contact).toEqual({ id: 'c1', name: 'Alice', replied: false })
    })

    test('getAllContacts', async () => {
        const contacts = await ContactService.getAllContacts()
        expect(contacts).toEqual([{ id: 'c1', name: 'Alice', replied: false }])
    })

    test('getContactById - found', async () => {
        const contact = await ContactService.getContactById('c1')
        expect(contact).toEqual({ id: 'c1', name: 'Alice', replied: false })
    })

    test('getContactById - not found', async () => {
        const contact = await ContactService.getContactById('invalid')
        expect(contact).toBeNull()
    })

    test('updateReplyStatus', async () => {
        const contact = await ContactService.updateReplyStatus('c1', { replied: true })
        expect(contact).toEqual({ id: 'c1', name: 'Alice', replied: true })
    })

    test('deleteContact', async () => {
        const result = await ContactService.deleteContact('c1')
        expect(result).toBe(true)
    })
})
