import rateLimit from 'express-rate-limit'

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many login attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false
})

const contactLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 3,
    message: 'Too many contact form submissions, please try again later.',
    standardHeaders: true,
    legacyHeaders: false
})

export default {
    loginLimiter,
    contactLimiter
}