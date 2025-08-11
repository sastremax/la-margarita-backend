import { z } from 'zod'

export const imageSchema = z.object({
    url: z.string().url(),
    name: z.string().min(1),
    type: z.enum(['profile', 'product', 'lodging', 'review', 'other']),
    refId: z.string().min(1),
    publicId: z.string().optional()
})

export function asPublicImage(image) {
    if (!image) return null
    const id = image._id?.toString?.() || image.id || null
    const refId =
        image.associatedId?._id?.toString?.() ||
        image.associatedId?.toString?.() ||
        image.associatedId ||
        null
    const type = image.associatedType || image.type || null
    const publicId = image.public_id || image.publicId || null
    const createdAt =
        image.createdAt?.toISOString?.() ||
        (typeof image.createdAt === 'string' ? image.createdAt : null)
    const updatedAt =
        image.updatedAt?.toISOString?.() ||
        (typeof image.updatedAt === 'string' ? image.updatedAt : null)
    return {
        id,
        url: image.url || null,
        name: image.name || null,
        type,
        refId,
        publicId,
        createdAt,
        updatedAt
    }
}
