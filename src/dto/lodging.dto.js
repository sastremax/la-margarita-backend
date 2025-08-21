import { z } from 'zod'

export const lodgingSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    images: z.array(z.string().url()).optional(),
    location: z.object({
        country: z.string().min(1),
        province: z.string().min(1),
        city: z.string().min(1)
    }),
    capacity: z.coerce.number().int().positive(),
    pricing: z.object({
        weekday: z.coerce.number().min(0),
        weekend: z.coerce.number().min(0),
        holiday: z.coerce.number().min(0).optional()
    }),
    ownerId: z.string().min(1)
})

export function asPublicLodging(lodging) {
    if (!lodging) return null
    const id = lodging._id?.toString?.() || lodging.id || null
    const ownerId =
        lodging.owner?._id?.toString?.() ||
        lodging.owner?.toString?.() ||
        lodging.owner?.id ||
        null
    const images = Array.isArray(lodging.images) ? lodging.images : []
    const pricing = lodging.pricing || {}
    return {
        id,
        title: lodging.title || null,
        description: lodging.description || null,
        images,
        location: lodging.location || null,
        capacity: typeof lodging.capacity === 'number' ? lodging.capacity : null,
        pricing: {
            weekday: Number.isFinite(pricing.weekday) ? pricing.weekday : 0,
            weekend: Number.isFinite(pricing.weekend) ? pricing.weekend : 0,
            holiday: Number.isFinite(pricing.holiday) ? pricing.holiday : undefined
        },
        ownerId,
        isActive: typeof lodging.isActive === 'boolean' ? lodging.isActive : true
    }
}
