import express from 'express'
import { param } from 'express-validator'

import { replyToContact, submitContactForm } from '../controllers/contact.controller.js'
import { contactDTO } from '../dto/contact.dto.js'
import { authPolicy } from '../middlewares/authPolicy.middleware.js'
import { contactLimiter } from '../middlewares/rateLimiter.js'
import { validateDTO } from '../middlewares/validateDTO.middleware.js'
import { validateRequest } from '../middlewares/validateRequest.middleware.js'

const router = express.Router()

router.post('/', contactLimiter, validateDTO(contactDTO.contactSchema), submitContactForm)

router.put(
    '/:id/reply',
    param('id').isMongoId().withMessage('Invalid contact ID'),
    validateRequest,
    authPolicy(['admin']),
    validateDTO(contactDTO.replySchema),
    replyToContact
)

export const contactRouter = router
