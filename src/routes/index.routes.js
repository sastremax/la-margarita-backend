import express from 'express'
import authRouter from './auth.routes.js'
import reservationsRouter from './reservations.routes.js'
import housesRouter from './houses.routes.js'

const router = express.Router()

router.use('/auth', authRouter)
router.use('/reservations', reservationsRouter)
router.use('/houses', housesRouter)

export default router
