import { v4 as uuidv4 } from 'uuid'
import logger from '../utils/logger.js'

function loggerMiddleware(req, res, next) {
    const requestId = uuidv4()
    const start = Date.now()
    req.requestId = requestId

    res.on('finish', () => {
        try {
            const duration = Date.now() - start
            const userEmail = req.user?.email
            const userId = req.user?.id
            const user = userEmail || userId || 'Guest'

            let level = 'info'
            if (res.statusCode >= 500) {
                level = 'error'
            } else if (res.statusCode >= 400) {
                level = 'warn'
            }

            const logEntry = {
                requestId,
                method: req.method,
                url: req.originalUrl,
                statusCode: res.statusCode,
                user,
                ip: req.ip,
                durationMs: duration,
                userAgent: req.headers['user-agent'] || '',
                referer: req.headers['referer'] || ''
            }

            logger[level]('[AUDIT]', logEntry)
        } catch (error) {
            logger.error('[AUDIT ERROR] Logging failed: ' + error.message)
        }
    })

    next()
}

export default loggerMiddleware