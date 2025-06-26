import express from 'express'
import userController from '../controllers/user.controller.js'
import authPolicy from '../middlewares/authPolicy.middleware.js'
import universalAuth from '../middlewares/universalAuth.middleware.js'

const router = express.Router()

router.get('/', authPolicy(['admin']), userController.getAllUsers)
router.get('/:uid', authPolicy(['admin']), userController.getUserById)
router.get('/me', universalAuth, userController.getCurrentUser)
router.get('/me/reservations', authPolicy(['user']), userController.getCurrentUserReservations)
router.get('/me/cart', authPolicy(['user']), userController.getCurrentUserCart)
router.delete('/:uid', authPolicy(['admin']), userController.deleteUser)
router.put('/:uid/role', authPolicy(['admin']), userController.updateUserRole)

export default router
