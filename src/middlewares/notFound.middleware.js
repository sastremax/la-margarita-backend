import ApiError from '../utils/apiError.js'

export const notFound = function (req, res, next) {
    next(new ApiError(404, 'Route ' + req.originalUrl + ' not found'))
}
