import mongoose from 'mongoose'

const contactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },
        message: {
            type: String,
            required: true,
            trim: true,
            minlength: 10,
            maxlength: 2000
        },
        replied: {
            type: Boolean,
            default: false
        },
        replyNote: {
            type: String,
            default: ''
        }
    },
    {
        timestamps: true
    }
)

export const ContactModel = mongoose.model('Contact', contactSchema)
