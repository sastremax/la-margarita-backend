import express from 'express'
import lodgingController from '../controllers/lodging.controller.js'
import authPolicy from '../middlewares/authPolicy.middleware.js'
import validateDTO from '../middlewares/validateDTO.middleware.js'
import lodgingDTO from '../dto/lodging.dto.js'

const router = express.Router()

router.get('/', lodgingController.getAllLodgings)
router.get('/:lid', lodgingController.getLodgingById)
router.post('/', authPolicy(['admin']), validateDTO(lodgingDTO.lodgingSchema), lodgingController.createLodging)
router.put('/:lid', authPolicy(['admin']), validateDTO(lodgingDTO.lodgingSchema), lodgingController.updateLodging)
router.delete('/:lid', authPolicy(['admin']), lodgingController.deleteLodging)

export default router