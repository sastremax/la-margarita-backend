import logger from '../config/logger.js'

export const errorHandler = function (err, req, res, next) {
    const statusCode = typeof err.statusCode === 'number' ? err.statusCode : 500
    const message = typeof err.message === 'string' && err.message.length > 0 ? err.message : 'Internal server error'
    const timestamp = new Date().toISOString()
    const requestId = req.requestId || 'no-request-id'

    logger.error(timestamp + ' - ' + requestId + ' - ' + statusCode + ' - ' + message + ' - ' + req.originalUrl + ' - ' + req.method + ' - ' + req.ip)

    const response = {
        status: 'error',
        message: message
    }

    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack
    }

    res.status(statusCode).json(response)
}
