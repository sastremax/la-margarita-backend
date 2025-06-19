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