import mongoose from 'mongoose'

const lodgingSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 100
        },
        description: {
            type: String,
            required: true,
            minlength: 20
        },
        images: {
            type: [String],
            default: [],
            validate: {
                validator: (arr) => arr.every((url) => typeof url === 'string'),
                message: 'All images must be valid strings'
            }
        },
        location: {
            country: {
                type: String,
                default: 'Argentina'
            },
            province: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            }
        },
        capacity: {
            type: Number,
            required: true,
            min: 1
        },
        pricing: {
            weekday: { type: Number, required: true, min: 0 },
            weekend: { type: Number, required: true, min: 0 },
            holiday: { type: Number, required: false, min: 0 }
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.model('Lodging', lodgingSchema)
