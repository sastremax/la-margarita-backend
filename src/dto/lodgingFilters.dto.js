import { z } from 'zod'

export const lodgingFiltersSchema = z.object({
    city: z.string().min(1).optional(),
    province: z.string().min(1).optional(),
    country: z.string().min(1).optional(),
    owner: z.string().min(1).optional(),
    isActive: z.enum(['true', 'false']).optional(),
    capacity: z.string().regex(/^\d+$/).optional()
})