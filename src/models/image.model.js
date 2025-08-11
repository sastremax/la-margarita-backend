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
            maxlength: 255
        },
        name: {
            type: String,
            required: true,
            maxlength: 255
        },
        associatedType: {
            type: String,
            enum: ['profile', 'product', 'lodging', 'review', 'other'],
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
