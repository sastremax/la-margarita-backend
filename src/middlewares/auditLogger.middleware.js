import uuid from 'uuid'

const v4 = uuid.v4

import logger from '../utils/logger.js'

export default function auditLogger(req, res, next) {
    const requestId = v4()
    const start = Date.now()

    req.requestId = requestId

    res.on('finish', () => {
        try {
            const duration = Date.now() - start
            const user = req.user && req.user.email ? req.user.email : req.user && req.user.id ? req.user.id : 'Guest'
            const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info'

            const logEntry = {
                requestId: requestId,
                method: req.method,
                url: req.originalUrl,
                statusCode: res.statusCode,
                user: user,
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