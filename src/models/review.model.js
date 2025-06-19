import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lodging: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lodging',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    adminReply: {
        message: {
            type: String,
            default: null
        },
        createdAt: {
            type: Date,
            default: null
        }
    }
}, {
    timestamps: true
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
