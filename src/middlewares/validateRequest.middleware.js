import validationResult from 'express-validator/src/validation-result.js'
import ApiError from '../utils/apiError.js'

function validateRequest(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(new ApiError(400, JSON.stringify(errors.array())))
    }
    next()
}

export default validateRequest


