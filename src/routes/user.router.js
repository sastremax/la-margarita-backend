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

const router = express.Router()

router.get('/', authPolicy(['admin']), getAllUsers)
router.get('/:uid', authPolicy(['admin']), getUserById)
router.get('/me', universalAuth, getCurrentUser)
router.get('/me/reservations', authPolicy(['user']), getCurrentUserReservations)
router.get('/me/cart', authPolicy(['user']), getCurrentUserCart)
router.delete('/:uid', authPolicy(['admin']), deleteUser)
router.put('/:uid/role', authPolicy(['admin']), updateUserRole)

export const userRouter = router