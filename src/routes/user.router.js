import express from 'express'
import {
    getAllUsers,
    getUserById,
    getCurrentUser,
    getCurrentUserReservations,
    getCurrentUserCart,
    deleteUser,
    updateUserRole
} from '../controllers/user.controller.js'
import { authPolicy } from '../middlewares/authPolicy.middleware.js'
import { universalAuth } from '../middlewares/universalAuth.middleware.js'
import { param } from 'express-validator'
import { validateRequest } from '../middlewares/validateRequest.middleware.js'

const router = express.Router()

router.get('/', authPolicy(['admin']), getAllUsers)

router.get(
    '/:uid',
    param('uid').isMongoId().withMessage('Invalid user ID'),
    validateRequest,
    authPolicy(['admin']),
    getUserById
)

router.get('/me', universalAuth, getCurrentUser)
router.get('/me/reservations', authPolicy(['user']), getCurrentUserReservations)
router.get('/me/cart', authPolicy(['user']), getCurrentUserCart)

router.delete(
    '/:uid',
    param('uid').isMongoId().withMessage('Invalid user ID'),
    validateRequest,
    authPolicy(['admin']),
    deleteUser
)

router.put(
    '/:uid/role',
    param('uid').isMongoId().withMessage('Invalid user ID'),
    validateRequest,
    authPolicy(['admin']),
    updateUserRole
)

export const userRouter = router
