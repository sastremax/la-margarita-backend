import z from 'zod'

const contactSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Must be a valid email'),
    message: z.string().min(10, 'Message must be at least 10 characters')
})

function asPublicContact(contact) {
    return {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        message: contact.message,
        createdAt: contact.createdAt
    }
}

const contactDTO = {
    contactSchema,
    asPublicContact
}

export default contactDTO
