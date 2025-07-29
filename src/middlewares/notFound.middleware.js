import { ApiError } from '../utils/apiError.js'

export const notFound = (req, _, next) => {
    next(new ApiError(404, `Route ${req.originalUrl} not found`))
}