import { z } from 'zod'

export const lodgingSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    location: z.string().min(1),
    pricePerNight: z.number().positive(),
    capacity: z.number().int().positive(),
    type: z.enum(['house', 'cabin', 'apartment', 'other']),
    images: z.array(z.string().url()).optional(),
    owner: z.string().min(1).optional()
})

export function asPublicLodging(lodging) {
    return {
        id: lodging._id,
        title: lodging.title,
        description: lodging.description,
        location: lodging.location,
        pricePerNight: lodging.pricePerNight,
        capacity: lodging.capacity,
        type: lodging.type,
        images: lodging.images || [],
        ownerId: lodging.owner?._id || null
    }
}