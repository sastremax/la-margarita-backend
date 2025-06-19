import express from 'express'
import * as authController from '../controllers/auth.controller.js'
import validateDTO from '../middlewares/validateDTO.middleware.js'
import { userSchemaRegister } from '../dto/user.dto.js'

const router = express.Router()

router.post('/login', authController.postLogin)
router.post('/register', validateDTO(userSchemaRegister), authController.postRegister)
router.post('/logout', authController.postLogout)

export default router