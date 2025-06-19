import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        accommodation: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
            validate: {
                validator: Number.isInteger,
                message: '{VALUE} is not an integer value'
            }
        },
        comment: {
            type: String,
            minlength: 3
        }
    },
    { timestamps: true }
)

reviewSchema.index({ user: 1, accommodation: 1 }, { unique: true })

export default mongoose.model('Review', reviewSchema)
