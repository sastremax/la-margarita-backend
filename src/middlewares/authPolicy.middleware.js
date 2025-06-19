import passport from 'passport'
import ApiError from '../utils/apiError.js'

export const passportWithPolicy = (roles = []) => {
    return [
        passport.authenticate('jwt-bearer', { session: false }),
        (req, res, next) => {
            try {
                if (!req.user) {
                    throw new ApiError(401, 'Not authenticated')
                }

                if (!roles.includes(req.user?.role)) {
                    throw new ApiError(403, 'Access denied')
                }

                next()
            } catch (error) {
                next(error)
            }
        }
    ]
}
