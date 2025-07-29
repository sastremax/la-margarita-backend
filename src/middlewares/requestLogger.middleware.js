import { logger } from '../config/logger.js'

export const requestLogger = (req, res, next) => {
    const start = Date.now()
    const user = req.user?.email || req.user?.id || 'Guest'
    const ip = req.ip || req.connection?.remoteAddress || 'Unknown IP'
    const requestId = req.requestId || 'no-request-id'
    let logged = false

    const logRequest = () => {
        if (logged) return
        logged = true
        const duration = Date.now() - start
        const logEntry = {
            requestId: requestId,
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            user: user,
            ip: ip,
            durationMs: duration,
            timestamp: new Date().toISOString()
        }

        if (res.statusCode >= 400) {
            logger.error('REQUEST', logEntry)
        } else {
            logger.info('REQUEST', logEntry)
        }
    }

    res.on('finish', logRequest)
    res.on('close', logRequest)

    next()
}
