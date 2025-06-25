import ApiError from '../utils/apiError.js'

export default function notFound(req, res, next) {
    next(new ApiError(404, `Route ${req.originalUrl} not found`))
}