import mongoose from 'mongoose'

const reservationSchema = new mongoose.Schema(
    {
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
        checkIn: {
            type: Date,
            required: true
        },
        checkOut: {
            type: Date,
            required: true
        },
        guests: {
            type: Number,
            default: 1
        },
        totalPrice: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            enum: ['confirmed', 'cancelled'],
            default: 'confirmed'
        }
    },
    {
        timestamps: true
    }
)

export const ReservationModel = mongoose.model('Reservation', reservationSchema)
