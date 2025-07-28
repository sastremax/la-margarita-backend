import express from 'express'
import { postLogin, postRegister, postLogout } from '../controllers/auth.controller.js'
import refreshController from '../controllers/refresh.controller.js'
import validateDTO from '../middlewares/validateDTO.middleware.js'
import userSchema from '../dto/user.schema.js'
import universalAuth from '../middlewares/universalAuth.middleware.js'
import rateLimiter from '../middlewares/rateLimiter.js'

const router = express.Router()

router.post('/login', rateLimiter.loginLimiter, postLogin)

router.post('/register', validateDTO(userSchema.userSchemaRegister), postRegister)

router.post('/logout', universalAuth, postLogout)

router.post('/refresh', universalAuth, refreshController.postRefresh)

export { router }
