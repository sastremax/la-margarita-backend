import Review from '../models/review.model.js';

export async function createReview(data) {
    return await Review.create(data);
}

export async function getReviewsByLodging(lodgingId) {
    return await Review.find({ lodging: lodgingId }).populate('user', 'firstName lastName');
}

export async function deleteReview(reviewId, userId, isAdmin) {
    const review = await Review.findById(reviewId);
    if (!review) {
        throw new Error('Review not found');
    }

    if (!isAdmin && review.user.toString() !== userId) {
        throw new Error('Not authorized to delete this review');
    }

    await Review.findByIdAndDelete(reviewId);
}

export async function addAdminReply(reviewId, message) {
    const review = await Review.findById(reviewId);
    if (!review) {
        throw new Error('Review not found');
    }

    if (review.adminReply.message) {
        throw new Error('Reply already exists');
    }

    review.adminReply.message = message;
    review.adminReply.createdAt = new Date();
    await review.save();
    return review;
}
