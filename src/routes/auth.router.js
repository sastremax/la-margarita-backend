import express from 'express'
import authController from '../controllers/auth.controller.js'
import refreshController from '../controllers/refresh.controller.js'
import validateDTO from '../middlewares/validateDTO.middleware.js'
import userDTO from '../dto/user.dto.js'
import universalAuth from '../middlewares/universalAuth.middleware.js'

const router = express.Router()

router.post('/login', authController.postLogin)
router.post('/register', validateDTO(userDTO.userSchemaRegister), authController.postRegister)
router.post('/logout', universalAuth, authController.postLogout)
router.post('/refresh', universalAuth, refreshController.postRefresh)

export default router
