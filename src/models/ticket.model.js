import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

const ticketProductSchema = new mongoose.Schema(
    {
        product: { type: Object, required: true },
        quantity: { type: Number, required: true, min: 1 }
    },
    { _id: false }
)

const ticketSchema = new mongoose.Schema(
    {
        code: { type: String, default: uuidv4, unique: true, immutable: true },
        purchaser: { type: String, required: true, trim: true, index: true },
        amount: { type: Number, required: true, min: 0 },
        products: {
            type: [ticketProductSchema],
            required: true,
            validate: v => Array.isArray(v) && v.length > 0
        },
        createdAt: { type: Date, default: Date.now, immutable: true }
    },
    { versionKey: false }
)

const TicketModel = mongoose.model('Ticket', ticketSchema)

export default TicketModel