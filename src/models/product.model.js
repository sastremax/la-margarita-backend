import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, maxlength: 100 },
        description: { type: String, maxlength: 1000 },
        price: { type: Number, required: true, min: 0 },
        stock: { type: Number, default: 0, min: 0 },
        code: { type: String, required: true, unique: true, match: /^[a-zA-Z0-9-_]+$/ },
        category: { type: String, enum: ['food', 'service'], required: true },
        status: { type: Boolean, default: true },
        images: [{ type: String, match: /^https?:\/\/.+/ }]
    },
    { timestamps: true }
)

export default mongoose.model('Product', productSchema)
