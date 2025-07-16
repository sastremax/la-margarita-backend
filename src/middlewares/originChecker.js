import ApiError from '../utils/apiError.js'
import config from '../config/index.js'

const allowedOriginsString = config.corsOrigin || 'https://tu-dominio.com'
const allowedOrigins = allowedOriginsString.split(',')

const originChecker = function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true)
    } else {
        callback(new ApiError(403, 'Not allowed by CORS'))
    }
}

export default originChecker