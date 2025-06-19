import logger from '../utils/logger.js'

export default function requestLogger(req, res, next) {
    const start = Date.now()
    const user = req.user?.email || req.user?.id || 'Guest'
    const ip = req.ip || req.connection?.remoteAddress || 'Unknown IP'

    function logRequest() {
        const duration = Date.now() - start
        const message = `${req.method} ${req.originalUrl} - Status: ${res.statusCode} - User: ${user} - IP: ${ip} - Duration: ${duration}ms`
        if (res.statusCode >= 400) {
            logger.error(message)
        } else {
            logger.info(message)
        }
    }

    res.on('finish', logRequest)
    res.on('close', logRequest)

    next()
}
