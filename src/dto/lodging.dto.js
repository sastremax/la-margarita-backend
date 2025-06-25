import z from 'zod'

const lodgingSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    images: z.array(z.string().url()).optional(),
    location: z.object({
        country: z.string().min(1),
        province: z.string().min(1),
        city: z.string().min(1)
    }),
    capacity: z.number().int().positive(),
    pricing: z.record(z.string(), z.number().positive()),
    owner: z.string().min(1).optional(),
    isActive: z.boolean().optional()
})

function asPublicLodging(lodging) {
    return {
        id: lodging._id,
        title: lodging.title,
        description: lodging.description,
        images: lodging.images || [],
        images: lodging.images || [],
        location: lodging.location,
        capacity: lodging.capacity,
        pricing: lodging.pricing,
        ownerId: lodging.owner?._id || lodging.owner || null,
        isActive: lodging.isActive,
        pricing: lodging.pricing,
        ownerId: lodging.owner?._id || lodging.owner || null,
        isActive: lodging.isActive
    }
}

const lodgingDTO = {
    lodgingSchema,
    asPublicLodging
}

export default lodgingDTO
