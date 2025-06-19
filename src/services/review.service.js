import Review from '../models/review.model.js'

export async function createReview(data) {
    return await Review.create(data)
}

export async function getReviewsByLodging(lodgingId, { page = 1, limit = 10 }) {
    const skip = (page - 1) * limit

    const [total, reviews] = await Promise.all([
        Review.countDocuments({ lodging: lodgingId }),
        Review.find({ lodging: lodgingId })
            .populate('user', 'firstName lastName')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
    ])

    return {
        total,
        page,
        limit,
        reviews
    }
}

export async function deleteReview(reviewId, userId, isAdmin) {
    const review = await Review.findById(reviewId)
    if (!review) throw new Error('Review not found')
    if (!isAdmin && review.user.toString() !== userId) {
        throw new Error('Not authorized to delete this review')
    }
    await Review.findByIdAndDelete(reviewId)
}

export async function addAdminReply(reviewId, message) {
    const review = await Review.findById(reviewId)
    if (!review) throw new Error('Review not found')
    if (review.adminReply.message) throw new Error('Reply already exists')

    review.adminReply.message = message
    review.adminReply.createdAt = new Date()
    await review.save()
    return review
}

export async function getLodgingReviewSummary(lodgingId) {
    const reviews = await Review.find({ lodging: lodgingId })

    if (reviews.length === 0) return null

    const total = reviews.length
    const sum = (key) => reviews.reduce((acc, r) => acc + (r[key] || 0), 0)

    return {
        totalReviews: total,
        averageOverall: parseFloat((sum('rating') / total).toFixed(1)),
        averageCleanliness: parseFloat((sum('cleanliness') / total).toFixed(1)),
        averageLocation: parseFloat((sum('location') / total).toFixed(1)),
        averageService: parseFloat((sum('service') / total).toFixed(1)),
        averageValueForMoney: parseFloat((sum('valueForMoney') / total).toFixed(1))
    }
}