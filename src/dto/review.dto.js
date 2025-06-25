import z from 'zod'

const reviewSchema = z.object({
    user: z.string().min(1),
    lodging: z.string().min(1),
    rating: z.number().int().min(1).max(5),
    cleanliness: z.number().min(1).max(5).optional(),
    location: z.number().min(1).max(5).optional(),
    service: z.number().min(1).max(5).optional(),
    valueForMoney: z.number().min(1).max(5).optional(),
    comment: z.string().min(1)
})

function asPublicReview(review) {
    return {
        id: review._id,
        lodgingId: review.lodging?._id || review.lodging || null,
        user: {
            id: review.user?._id || review.user || null,
            firstName: review.user?.firstName || null,
            country: review.user?.country || null
        },
        rating: review.rating,
        cleanliness: review.cleanliness,
        location: review.location,
        service: review.service,
        valueForMoney: review.valueForMoney,
        comment: review.comment,
        adminReply: review.adminReply || null,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt
    }
}

const reviewDTO = {
    reviewSchema,
    asPublicReview
}

export default reviewDTO