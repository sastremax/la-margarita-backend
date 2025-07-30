import rateLimit from 'express-rate-limit'
import { rateLimitHandler } from './rateLimitHandler.js'

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    handler: rateLimitHandler,
    message: 'Too many login attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false
})

export const contactLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 3,
    handler: rateLimitHandler,
    message: 'Too many contact form submissions, please try again later.',
    standardHeaders: true,
    legacyHeaders: false
})

export const globalLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100,
    handler: rateLimitHandler,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false
})
