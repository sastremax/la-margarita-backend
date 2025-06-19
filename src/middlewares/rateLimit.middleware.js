import rateLimit from 'express-rate-limit'
import logger from '../utils/logger.js'

const limiter = rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX) || 100,
    message: { status: 'error', message: 'Too many requests, please try again later.' },
    headers: true,
    handler: (req, res, next, options) => {
        logger.warn(`Rate limit exceeded for IP ${req.ip} on ${req.originalUrl}`)
        res.status(options.statusCode).json(options.message)
    }
})

export default limiter

