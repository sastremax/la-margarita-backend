import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        accommodation: { type: String, required: true },
        rating: { type: Number, min: 1, max: 5, required: true },
        comment: { type: String }
    },
    { timestamps: true }
)

export default mongoose.model('Review', reviewSchema)
