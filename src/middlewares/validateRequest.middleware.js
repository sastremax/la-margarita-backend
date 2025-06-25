import { validationResult } from 'express-validator'
import ApiError from '../utils/apiError.js'

export default function validateRequest(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(new ApiError(400, JSON.stringify(errors.array())))
    }
    next()
}


