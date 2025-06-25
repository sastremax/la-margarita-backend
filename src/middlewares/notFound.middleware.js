import ApiError from '../utils/apiError.js'

function notFound(req, res, next) {
    next(new ApiError(404, 'Route ' + req.originalUrl + ' not found'))
}

export default notFound