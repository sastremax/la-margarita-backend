import express from 'express'

import authRouter from './auth.router.js'
import userRouter from './user.router.js'
import productRouter from './product.router.js'
import cartRouter from './cart.router.js'
import reservationRouter from './reservation.router.js'
import reviewRouter from './review.router.js'
import imageRouter from './image.router.js'
import contactRouter from './contact.router.js'
import lodgingRouter from './lodging.router.js'

const router = express.Router()

router.use('/sessions', authRouter)
router.use('/users', userRouter)
router.use('/products', productRouter)
router.use('/carts', cartRouter)
router.use('/reservations', reservationRouter)
router.use('/reviews', reviewRouter)
router.use('/images', imageRouter)
router.use('/contact', contactRouter)
router.use('/lodgings', lodgingRouter)

export default router
