import mongoose from 'mongoose'

const imageSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            required: true,
            match: /^https?:\/\/.+/
        },
        public_id: {
            type: String,
            maxlength: 255,
            default: null
        },
        associatedType: {
            type: String,
            enum: ['product', 'accommodation', 'other'],
            required: true
        },
        associatedId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        }
    },
    { timestamps: true }
)

export default mongoose.model('Image', imageSchema)
