import { z } from 'zod'

const contactSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Must be a valid email'),
    message: z.string().min(10, 'Message must be at least 10 characters')
})

const replySchema = z.object({
    replied: z.boolean(),
    replyNote: z.string().max(1000).optional()
})

function asPublicContact(contact) {
    if (!contact) return null
    const id = contact._id?.toString?.() || contact.id || null
    const createdAt = contact.createdAt?.toISOString?.() || (typeof contact.createdAt === 'string' ? contact.createdAt : null)
    const updatedAt = contact.updatedAt?.toISOString?.() || (typeof contact.updatedAt === 'string' ? contact.updatedAt : null)
    return {
        id,
        name: contact.name || null,
        email: contact.email || null,
        message: contact.message || null,
        replied: typeof contact.replied === 'boolean' ? contact.replied : false,
        replyNote: typeof contact.replyNote === 'string' ? contact.replyNote : '',
        createdAt,
        updatedAt
    }
}

export const contactDTO = {
    contactSchema,
    replySchema,
    asPublicContact
}
