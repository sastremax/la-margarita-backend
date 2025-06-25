import Review from '../models/review.model.js'

export async function getReviewsByLodging(lodgingId, { page = 1, limit = 10, filters = {} }) {
    const skip = (page - 1) * limit
    const query = { lodging: lodgingId }

    if (filters.hasReply) {
        query['adminReply.message'] = { $ne: null }
    }

    if (filters.minRating !== null && !isNaN(filters.minRating)) {
        query.rating = { $gte: filters.minRating }
    }

    const [total, reviews] = await Promise.all([
        Review.countDocuments(query),
        Review.find(query)
            .populate('user', 'firstName lastName country')
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

export async function getReviewSummary(lodgingId) {
    const reviews = await Review.find({ lodging: lodgingId })

    const total = reviews.length
    const averageRating = total > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / total
        : 0

    return { totalReviews: total, averageRating: averageRating.toFixed(2) }
}

export async function deleteReview(reviewId, userId) {
    const review = await Review.findById(reviewId)

    if (!review) {
        const error = new Error('Review not found')
        error.statusCode = 404
        throw error
    }

    if (review.user.toString() !== userId.toString()) {
        const error = new Error('Forbidden')
        error.statusCode = 403
        throw error
    }

    await Review.findByIdAndDelete(reviewId)
}

export async function replyToReview(reviewId, message) {
    const review = await Review.findById(reviewId)

    if (!review) {
        const error = new Error('Review not found')
        error.statusCode = 404
        throw error
    }

    review.adminReply = {
        message,
        createdAt: new Date()
    }

    await review.save()
    return review
}