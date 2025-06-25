import express from 'express'
import * as authController from '../controllers/auth.controller.js'
import validateDTO from '../middlewares/validateDTO.middleware.js'
import userDTO from '../dto/user.dto.js'

const router = express.Router()

router.post('/login', authController.postLogin)
router.post('/register', validateDTO(userDTO.userSchemaRegister), authController.postRegister)
router.post('/logout', authController.postLogout)

export default router