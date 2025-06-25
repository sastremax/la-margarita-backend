import rateLimit from 'express-rate-limit'
import logger from '../config/logger.js'

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
    handler: function (req, res, next, options) {
        const requestId = req.requestId || 'no-request-id'
        logger.warn(
            new Date().toISOString() +
            ' - ' +
            requestId +
            ' - Rate limit exceeded for IP ' +
            req.ip +
            ' on ' +
            req.originalUrl
        )
        res.status(options.statusCode).json(options.message)
    }
})

export default limiter