import cors from 'cors'
import ApiError from '../utils/apiError.js'

const allowedOrigins = (process.env.CORS_ORIGINS || '').split(',')

export default cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new ApiError(403, 'Not allowed by CORS'))
        }
    },
    credentials: true
})
