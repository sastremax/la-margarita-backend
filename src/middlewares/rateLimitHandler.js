import logger from '../config/logger.js'

export const rateLimitHandler = function (req, res, next, options) {
    const requestId = req.requestId || 'no-request-id'
    logger.warn(
        new Date().toISOString() +
        ' - ' +
        requestId +
        ' - Rate limit exceeded for IP ' +
        req.ip +
        ' on ' +
        req.originalUrl
    )
    res.status(options.statusCode).json(options.message)
}
