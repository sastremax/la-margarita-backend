import jwtUtil from '../utils/jwt.util.js'
import ApiError from '../utils/apiError.js'
import UserModel from '../models/user.model.js'

export default async function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader?.startsWith('Bearer ')) {
            throw new ApiError(401, 'No token provided')
        }

        const token = authHeader.split(' ')[1]
        const decoded = jwtUtil.verifyToken(token)

        const user = await UserModel.findById(decoded.id)
        if (!user) {
            throw new ApiError(401, 'User not found')
        }

        req.user = user
        next()
    } catch (error) {
        next(error)
    }
}
