import express from 'express'
import * as contactController from '../controllers/contact.controller.js'
import { validateDTO } from '../middlewares/validateDTO.middleware.js'
import { contactDTO } from '../dto/contact.dto.js'
import { contactLimiter } from '../middlewares/rateLimiter.js'
import { authPolicy } from '../middlewares/authPolicy.middleware.js'
import { param } from 'express-validator'
import { validateRequest } from '../middlewares/validateRequest.middleware.js'

const router = express.Router()

router.post(
    '/',
    contactLimiter,
    validateDTO(contactDTO.contactSchema),
    contactController.submitContactForm
)

router.put(
    '/:id/reply',
    param('id').isMongoId().withMessage('Invalid contact ID'),
    validateRequest,
    authPolicy(['admin']),
    validateDTO(contactDTO.replySchema),
    contactController.replyToContact
)

export const contactRouter = router
