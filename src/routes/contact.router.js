import express from 'express'
import contactController from '../controllers/contact.controller.js'
import validateDTO from '../middlewares/validateDTO.middleware.js'
import contactDTO from '../dto/contact.dto.js'
import rateLimiter from '../middlewares/rateLimiter.js'
import authPolicy from '../middlewares/authPolicy.middleware.js'

const router = express.Router()

router.post(
    '/',
    rateLimiter.contactLimiter,
    validateDTO(contactDTO.contactSchema),
    contactController.submitContactForm
)

router.put(
    '/:id/reply',
    authPolicy(['admin']),
    validateDTO(contactDTO.replySchema),
    contactController.replyToContact
)

export default router