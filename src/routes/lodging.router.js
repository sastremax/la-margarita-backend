import express from 'express'
import * as lodgingController from '../controllers/lodging.controller.js'
import { passportWithPolicy } from '../middlewares/authPolicy.middleware.js'
import validateDTO from '../middlewares/validateDTO.middleware.js'
import { lodgingSchema } from '../dto/lodging.dto.js'

const router = express.Router()

router.get('/', lodgingController.getAllLodgings)
router.get('/:lid', lodgingController.getLodgingById)
router.post('/', passportWithPolicy(['admin']), validateDTO(lodgingSchema), lodgingController.createLodging)
router.put('/:lid', passportWithPolicy(['admin']), validateDTO(lodgingSchema), lodgingController.updateLodging)
router.delete('/:lid', passportWithPolicy(['admin']), lodgingController.deleteLodging)

export default router