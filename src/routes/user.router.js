import express from 'express'
import { param } from 'express-validator'
import { deleteUser, getAllUsers, getCurrentUser, getCurrentUserCart, getCurrentUserReservations, getUserById, updateUserRole } from '../controllers/user.controller.js'
import { authPolicy } from '../middlewares/authPolicy.middleware.js'
import { universalAuth } from '../middlewares/universalAuth.middleware.js'
import { validateRequest } from '../middlewares/validateRequest.middleware.js'

const router = express.Router()

router.get('/', universalAuth, authPolicy(['admin']), getAllUsers)

router.get('/me', universalAuth, getCurrentUser)
router.get('/me/reservations', universalAuth, authPolicy(['admin', 'user']), getCurrentUserReservations)
router.get('/me/cart', universalAuth, authPolicy(['admin', 'user']), getCurrentUserCart)

router.get(
    '/:uid',
    universalAuth,
    authPolicy(['admin']),
    param('uid').isMongoId().withMessage('Invalid user ID'),
    validateRequest,
    getUserById
)

router.delete(
    '/:uid',
    universalAuth,
    authPolicy(['admin']),
    param('uid').isMongoId().withMessage('Invalid user ID'),
    validateRequest,
    deleteUser
)

router.put(
    '/:uid/role',
    universalAuth,
    authPolicy(['admin']),
    param('uid').isMongoId().withMessage('Invalid user ID'),
    validateRequest,
    updateUserRole
)

export const userRouter = router
