import { validationResult as validate } from 'express-validator'
import ApiError from '../utils/apiError.js'

export const _setValidator = function (fn) {
    validateRequest.__validate = fn
}

export const validateRequest = function (req, res, next) {
    const errors = (validateRequest.__validate || validate)(req)
    if (!errors.isEmpty()) {
        return next(new ApiError(400, JSON.stringify(errors.array())))
    }
    next()
}
