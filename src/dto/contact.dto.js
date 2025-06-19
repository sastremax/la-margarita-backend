import { z } from 'zod'

export const contactSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    message: z.string().min(1)
})

export function asPublicContact(contact) {
    return {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        message: contact.message,
        createdAt: contact.createdAt
    }
}
