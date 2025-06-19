import rateLimit from 'express-rate-limit'
import logger from '../utils/logger.js'

const contactLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 3,
    message: { status: 'error', message: 'Too many contact form submissions. Please try again later.' },
    handler: (req, res, next, options) => {
        logger.warn(`Contact rate limit exceeded for IP ${req.ip} on ${req.originalUrl}`)
        res.status(options.statusCode).json(options.message)
    }
})

export default contactLimiter
