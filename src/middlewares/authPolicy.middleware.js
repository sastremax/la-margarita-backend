import passport from 'passport'
import ApiError from '../utils/apiError.js'

const isArray = function (value) {
    return Object.prototype.toString.call(value) === '[object Array]'
}

const authPolicy = function (roles) {
    if (!roles) roles = []
    if (!isArray(roles)) roles = [roles]

    return [
        passport.authenticate('jwt-bearer', { session: false }),
        function (req, res, next) {
            try {
                if (!req.user) {
                    throw new ApiError(401, 'Not authenticated')
                }

                if (roles.length > 0 && !roles.includes(req.user.role)) {
                    throw new ApiError(403, 'Access denied')
                }

                next()
            } catch (error) {
                next(error)
            }
        }
    ]
}

export default authPolicy
