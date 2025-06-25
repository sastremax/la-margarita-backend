import express from 'express'
import * as contactController from '../controllers/contact.controller.js'
import validateDTO from '../middlewares/validateDTO.middleware.js'
import { contactSchema } from '../dto/contact.dto.js'
import contactLimiter from '../middlewares/contactLimiter.middleware.js'

const router = express.Router()

router.post(
    '/',
    contactLimiter,
    validateDTO(contactSchema),
    contactController.submitContactForm
)

export default router
