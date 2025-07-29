import { ApiError } from '../utils/apiError.js'

export const verifyOwnership = (getResourceOwnerId) => {
    return async (req, res, next) => {
        try {
            const resourceOwnerId = await getResourceOwnerId(req)
            const requesterId = req.user?.id

            if (!requesterId || !resourceOwnerId || requesterId !== resourceOwnerId.toString()) {
                throw new ApiError(403, 'Access denied: You do not own this resource')
            }

            next()
        } catch (error) {
            next(error)
        }
    }
}
