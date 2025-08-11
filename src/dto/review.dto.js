import { z } from 'zod'

const reviewSchema = z.object({
    user: z.string().min(1),
    lodging: z.string().min(1),
    reservation: z.string().min(1),
    rating: z.coerce.number().int().min(1).max(5),
    cleanliness: z.coerce.number().min(1).max(5).optional(),
    location: z.coerce.number().min(1).max(5).optional(),
    service: z.coerce.number().min(1).max(5).optional(),
    valueForMoney: z.coerce.number().min(1).max(5).optional(),
    comment: z.string().min(1)
})

const reviewQuerySchema = z.object({
    lodgingId: z.string().optional(),
    hasReply: z
        .union([z.boolean(), z.enum(['true', 'false']).transform((v) => v === 'true')])
        .optional(),
    minRating: z.coerce.number().min(1).max(5).optional()
})

const reviewUpdateSchema = z.object({
    rating: z.coerce.number().int().min(1).max(5).optional(),
    cleanliness: z.coerce.number().min(1).max(5).optional(),
    location: z.coerce.number().min(1).max(5).optional(),
    service: z.coerce.number().min(1).max(5).optional(),
    valueForMoney: z.coerce.number().min(1).max(5).optional(),
    comment: z.string().min(1).optional(),
    adminReply: z
        .object({
            message: z.string().min(1),
            createdAt: z.coerce.date().optional()
        })
        .optional()
})

function asPublicReview(review) {
    if (!review) return null
    const id = review._id?.toString?.() || review.id || null
    const lodgingId =
        review.lodging?._id?.toString?.() ||
        review.lodging?.toString?.() ||
        review.lodging?.id ||
        null
    const reservationId =
        review.reservation?._id?.toString?.() ||
        review.reservation?.toString?.() ||
        review.reservation?.id ||
        null
    const userId =
        review.user?._id?.toString?.() ||
        review.user?.toString?.() ||
        review.user?.id ||
        null
    const createdAt =
        review.createdAt?.toISOString?.() ||
        (typeof review.createdAt === 'string' ? review.createdAt : null)
    const updatedAt =
        review.updatedAt?.toISOString?.() ||
        (typeof review.updatedAt === 'string' ? review.updatedAt : null)
    const adminReply = review.adminReply
        ? {
            message: review.adminReply.message || null,
            createdAt:
                review.adminReply.createdAt?.toISOString?.() ||
                (typeof review.adminReply.createdAt === 'string' ? review.adminReply.createdAt : null)
        }
        : null
    return {
        id,
        lodgingId,
        reservationId,
        user: {
            id: userId,
            firstName: review.user?.firstName || null,
            country: review.user?.country || null
        },
        rating: typeof review.rating === 'number' ? review.rating : null,
        cleanliness: typeof review.cleanliness === 'number' ? review.cleanliness : null,
        location: typeof review.location === 'number' ? review.location : null,
        service: typeof review.service === 'number' ? review.service : null,
        valueForMoney: typeof review.valueForMoney === 'number' ? review.valueForMoney : null,
        comment: review.comment || null,
        adminReply,
        createdAt,
        updatedAt
    }
}

export const reviewDTO = {
    reviewSchema,
    reviewQuerySchema,
    reviewUpdateSchema,
    asPublicReview
}
