import mongoose from 'mongoose'

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
    reservation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reservation',
        required: true,
        unique: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    cleanliness: {
        type: Number,
        min: 1,
        max: 5,
        default: null
    },
    location: {
        type: Number,
        min: 1,
        max: 5,
        default: null
    },
    service: {
        type: Number,
        min: 1,
        max: 5,
        default: null
    },
    valueForMoney: {
        type: Number,
        min: 1,
        max: 5,
        default: null
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
})

reviewSchema.index({ reservation: 1 }, { unique: true })

const Review = mongoose.model('Review', reviewSchema)
export default Review