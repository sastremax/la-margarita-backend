import logger from '../config/logger.js'

export const auditLogger = (req, res, next) => {
    const userId = req.user?.id || 'anonymous'
    const ip = req.ip
    const method = req.method
    const url = req.originalUrl
    const timestamp = new Date().toISOString()

    logger.info(`[AUDIT] ${method} ${url} - User: ${userId} - IP: ${ip} - Time: ${timestamp}`)

    next()
}
