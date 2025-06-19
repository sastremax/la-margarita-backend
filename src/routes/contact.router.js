import express from 'express'
import * as contactController from '../controllers/contact.controller.js'
import validateDTO from '../middlewares/validateDTO.middleware.js'
import { contactSchema } from '../dto/contact.dto.js'

const router = express.Router()

router.post('/', validateDTO(contactSchema), contactController.submitContactForm)

export default router