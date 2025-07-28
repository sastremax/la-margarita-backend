import express from 'express'
import * as authController from '../controllers/auth.controller.js'
import { refreshController } from '../controllers/refresh.controller.js'
import { validateDTO } from '../middlewares/validateDTO.middleware.js'
import { userSchema } from '../dto/user.schema.js'
import { universalAuth } from '../middlewares/universalAuth.middleware.js'
import { loginLimiter } from '../middlewares/rateLimiter.js'

const router = express.Router()

router.post('/login', loginLimiter, authController.postLogin)

router.post('/register', validateDTO(userSchema.userSchemaRegister), authController.postRegister)

router.post('/logout', universalAuth, authController.postLogout)

router.post('/refresh', universalAuth, refreshController.postRefresh)

export const authRouter = router
