import express from 'express'

import { postLogin, postLogout, postRegister } from '../controllers/auth.controller.js'
import { postRefresh } from '../controllers/refresh.controller.js'
import { userSchemaRegister } from '../dto/user.schema.js'
import { loginLimiter } from '../middlewares/rateLimiter.js'
import { universalAuth } from '../middlewares/universalAuth.middleware.js'
import { validateDTO } from '../middlewares/validateDTO.middleware.js'

const router = express.Router()

router.post('/login', loginLimiter, postLogin)
router.post('/register', validateDTO(userSchemaRegister), postRegister)
router.post('/logout', universalAuth, postLogout)
router.post('/refresh', postRefresh)

export const authRouter = router
