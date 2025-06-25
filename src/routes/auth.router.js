import express from 'express'
import * as authController from '../controllers/auth.controller.js'

const router = express.Router()

router.post('/login', authController.postLogin)
router.post('/register', authController.postRegister)
router.post('/logout', authController.postLogout)

export default router

