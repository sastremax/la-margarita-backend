import rateLimit from 'express-rate-limit'
import logger from '../config/logger.js'

const windowMs = Number(process.env.CONTACT_RATE_LIMIT_WINDOW_MS) || 60000
const maxRequests = Number(process.env.CONTACT_RATE_LIMIT_MAX) || 3

const contactLimiter = rateLimit({
    windowMs: windowMs,
    max: maxRequests,
    message: {
        status: 'error',
        message: 'Too many contact form submissions. Please try again later.'
    },
    headers: true,
    handler: function (req, res, next, options) {
        const requestId = req.requestId || 'no-request-id'
        logger.warn(
            new Date().toISOString() +
            ' - ' +
            requestId +
            ' - Contact rate limit exceeded for IP ' +
            req.ip +
            ' on ' +
            req.originalUrl
        )
        res.status(options.statusCode).json(options.message)
    }
})

export default contactLimiter