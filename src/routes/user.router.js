import express from 'express'
import { param } from 'express-validator'

import {
    deleteUser,
    getAllUsers,
    getCurrentUser,
    getCurrentUserCart,
    getCurrentUserReservations,
    getUserById,
    updateUserRole
} from '../controllers/user.controller.js'
import { authPolicy } from '../middlewares/authPolicy.middleware.js'
import { universalAuth } from '../middlewares/universalAuth.middleware.js'
import { validateRequest } from '../middlewares/validateRequest.middleware.js'

const router = express.Router()

router.get('/', authPolicy(['admin']), getAllUsers)

router.get('/me', universalAuth, getCurrentUser)
router.get('/me/reservations', authPolicy(['admin', 'user']), getCurrentUserReservations)
router.get('/me/cart', authPolicy(['admin', 'user']), getCurrentUserCart)

router.get(
    '/:uid',
    param('uid').isMongoId().withMessage('Invalid user ID'),
    validateRequest,
    authPolicy(['admin']),
    getUserById
)

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
