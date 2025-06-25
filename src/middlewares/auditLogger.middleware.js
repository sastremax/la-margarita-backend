import logger from '../config/logger.js'

export default function auditLogger(req, res, next) {
    const start = Date.now()
    res.on('finish', () => {
        try {
            const duration = Date.now() - start
            const user = req.user?.email || req.user?.id || 'Guest'
            logger.info(`[AUDIT] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - User: ${user} - IP: ${req.ip} - Duration: ${duration}ms`)
        } catch (error) {
            logger.error(`[AUDIT ERROR] Logging failed: ${error.message}`)
        }
    })
    next()
}
