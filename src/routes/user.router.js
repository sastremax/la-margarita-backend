import express from 'express'
import * as userController from '../controllers/user.controller.js'

const router = express.Router()

router.get('/', userController.getAllUsers)
router.get('/:uid', userController.getUserById)
router.delete('/:uid', userController.deleteUser)
router.put('/:uid/role', userController.updateUserRole)

export default router
