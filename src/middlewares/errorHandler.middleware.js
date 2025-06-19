import logger from '../utils/logger.js'

export default function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal server error'
    logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`)
    const response = {
        status: 'error',
        message
    }
    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack
    }
    res.status(statusCode).json(response)
}


