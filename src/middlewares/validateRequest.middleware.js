
import { validationResult as validate } from 'express-validator'
import ApiError from '../utils/apiError.js'

export function _setValidator(fn) {
    validateRequest.__validate = fn
}

function validateRequest(req, res, next) {
    const errors = (validateRequest.__validate || validate)(req)
    if (!errors.isEmpty()) {
        return next(new ApiError(400, JSON.stringify(errors.array())))
    }
    next()
}

export default validateRequest
