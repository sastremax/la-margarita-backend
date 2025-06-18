import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        price: { type: Number, required: true },
        stock: { type: Number, default: 0 },
        code: { type: String, required: true, unique: true },
        category: { type: String, enum: ['food', 'service'], required: true },
        images: [{ type: String }]
    },
    { timestamps: true }
)

export default mongoose.model('Product', productSchema)
