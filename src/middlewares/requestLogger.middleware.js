import logger from '../utils/logger.js'

export default function requestLogger(req, res, next) {
    const start = Date.now()
    res.on('finish', () => {
        const duration = Date.now() - start
        logger.info(`${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`)
    })
    next()
}
