import { beforeEach, describe, expect, test, vi } from 'vitest'
import { replyToContact, submitContactForm } from '../../../src/controllers/contact.controller.js'
import { contactDTO } from '../../../src/dto/contact.dto.js'
import { contactService } from '../../../src/services/contact.service.js'

vi.mock('../../../src/services/contact.service.js', () => ({
    contactService: {
        createContact: vi.fn(),
        updateReplyStatus: vi.fn()
    }
}))

vi.mock('../../../src/dto/contact.dto.js', async () => {
    const actual = await vi.importActual('../../../src/dto/contact.dto.js')
    return {
        contactDTO: {
            ...actual.contactDTO,
            asPublicContact: vi.fn((c) => ({
                id: c._id,
                name: c.name,
                email: c.email,
                message: c.message,
                createdAt: c.createdAt
            }))
        }
    }
})

describe('contact.controller', () => {
    let req, res, next

    beforeEach(() => {
        vi.clearAllMocks()

        req = {
            body: {},
            params: {}
        }

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
            end: vi.fn()
        }

        next = vi.fn()
    })

    test('submitContactForm should return 201 with public contact', async () => {
        const fakeContact = {
            _id: 'c1',
            name: 'Test User',
            email: 'test@example.com',
            message: 'Hello',
            createdAt: new Date()
        }

        req.body = {
            name: 'Test User',
            email: 'test@example.com',
            message: 'Hello'
        }

        contactService.createContact.mockResolvedValue(fakeContact)

        await submitContactForm(req, res, next)

        expect(contactService.createContact).toHaveBeenCalledWith(req.body)
        expect(contactDTO.asPublicContact).toHaveBeenCalledWith(fakeContact)
        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: {
                id: 'c1',
                name: 'Test User',
                email: 'test@example.com',
                message: 'Hello',
                createdAt: fakeContact.createdAt
            }
        })
    })

    test('submitContactForm should call next on error', async () => {
        const error = new Error('fail')
        contactService.createContact.mockRejectedValue(error)

        await submitContactForm(req, res, next)

        expect(next).toHaveBeenCalledWith(error)
    })

    test('replyToContact should return 200 and updated contact on success', async () => {
        const updated = {
            id: 'c2',
            name: 'B',
            email: 'b@example.com',
            message: 'Hi',
            createdAt: new Date()
        }

        req.params.id = 'c2'
        req.body = { replied: true, replyNote: 'Gracias' }

        contactService.updateReplyStatus.mockResolvedValue(updated)

        await replyToContact(req, res, next)

        expect(contactService.updateReplyStatus).toHaveBeenCalledWith('c2', {
            replied: true,
            replyNote: 'Gracias'
        })

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            data: updated
        })
    })

    test('replyToContact should call next on error', async () => {
        const error = new Error('fail')
        contactService.updateReplyStatus.mockRejectedValue(error)

        await replyToContact(req, res, next)

        expect(next).toHaveBeenCalledWith(error)
    })
})
