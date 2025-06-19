import { z } from 'zod'

export const imageSchema = z.object({
    url: z.string().url(),
    name: z.string().min(1),
    type: z.enum(['profile', 'product', 'lodging', 'review', 'other']),
    refId: z.string().min(1).optional()
})

export function asPublicImage(image) {
    return {
        id: image._id,
        url: image.url,
        name: image.name,
        type: image.type,
        refId: image.refId || null,
        createdAt: image.createdAt,
        updatedAt: image.updatedAt
    }
}