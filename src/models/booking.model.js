import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        accommodation: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        totalPrice: { type: Number, required: true },
        status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
        products: [
            {
                product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
                quantity: { type: Number, default: 1 }
            }
        ]
    },
    { timestamps: true }
)

export default mongoose.model('Booking', bookingSchema)
