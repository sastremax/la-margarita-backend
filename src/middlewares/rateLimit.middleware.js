import rateLimit from 'express-rate-limit'
import rateLimitHandler from './rateLimitHandler.js'

const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS)
const maxRequests = Number(process.env.RATE_LIMIT_MAX)

const limiter = rateLimit({
    windowMs: Number.isNaN(windowMs) ? 900000 : windowMs,
    max: Number.isNaN(maxRequests) ? 100 : maxRequests,
    message: {
        status: 'error',
        message: 'Too many requests, please try again later.'
    },
    headers: true,
    handler: rateLimitHandler
})

export default limiter