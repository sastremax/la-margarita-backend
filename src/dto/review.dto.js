import { z } from 'zod'

export const reviewSchema = z.object({
    user: z.string().min(1),
    product: z.string().min(1),
    rating: z.number().int().min(1).max(5),
    comment: z.string().min(1)
})

export function asPublicReview(review) {
    return {
        id: review._id,
        userId: review.user?._id || null,
        productId: review.product?._id || null,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt
    }
}