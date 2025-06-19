import { z } from 'zod'

export const reviewSchema = z.object({
    user: z.string().min(1),
    lodging: z.string().min(1),
    rating: z.number().int().min(1).max(5),
    cleanliness: z.number().min(1).max(5).optional(),
    location: z.number().min(1).max(5).optional(),
    service: z.number().min(1).max(5).optional(),
    valueForMoney: z.number().min(1).max(5).optional(),
    comment: z.string().min(1)
})

export function asPublicReview(review) {
    return {
        id: review._id,
        userId: review.user?._id || null,
        lodgingId: review.lodging?._id || null,
        rating: review.rating,
        cleanliness: review.cleanliness,
        location: review.location,
        service: review.service,
        valueForMoney: review.valueForMoney,
        comment: review.comment,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt
    }
}