import z from 'zod'

const imageSchema = z.object({
    url: z.string().url(),
    name: z.string().min(1),
    type: z.enum(['profile', 'product', 'lodging', 'review', 'other']),
    refId: z.string().min(1),
    publicId: z.string().optional()
})

function asPublicImage(image) {
    return {
        id: image._id,
        url: image.url,
        name: image.name,
        type: image.associatedType,
        refId: image.associatedId,
        publicId: image.public_id || null,
        createdAt: image.createdAt,
        updatedAt: image.updatedAt
    }
}

const imageDTO = {
    imageSchema,
    asPublicImage
}

export default imageDTO