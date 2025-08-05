import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

const ticketProductSchema = new mongoose.Schema({
    product: {
        type: Object,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
}, { _id: false })

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        default: uuidv4,
        unique: true
    },
    purchaser: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    products: {
        type: [ticketProductSchema],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false })

const TicketModel = mongoose.model('Ticket', ticketSchema)

export default TicketModel
