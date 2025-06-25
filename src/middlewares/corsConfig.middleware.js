import cors from 'cors'
import ApiError from '../utils/apiError.js'

const allowedOriginsString = process.env.CORS_ORIGINS || 'https://tu-dominio.com'
const allowedOrigins = allowedOriginsString.split(',')

const corsMiddleware = cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new ApiError(403, 'Not allowed by CORS'))
        }
    },
    credentials: true
})

export default corsMiddleware