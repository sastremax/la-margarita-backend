import mongoose from 'mongoose'

const lodgingSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        images: {
            type: [String],
            default: []
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
            required: true
        },
        pricing: {
            type: Map,
            of: Number,
            required: true
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

const Lodging = mongoose.model('Lodging', lodgingSchema)
export default Lodging