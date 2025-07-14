import express from 'express'
import lodgingController from '../controllers/lodging.controller.js'
import authPolicy from '../middlewares/authPolicy.middleware.js'
import validateDTO from '../middlewares/validateDTO.middleware.js'
import lodgingDTO from '../dto/lodging.dto.js'
import existsLodging from '../middlewares/existsLodging.middleware.js'

const router = express.Router()

router.get('/', lodgingController.getAllLodgings)
router.get('/:lid', existsLodging, lodgingController.getLodgingById)
router.get('/owner/:uid', authPolicy(['admin', 'user']), lodgingController.getLodgingsByOwner)

router.post(
    '/',
    authPolicy(['admin']),
    validateDTO(lodgingDTO.lodgingSchema),
    lodgingController.createLodging
)

router.put(
    '/:lid',
    authPolicy(['admin']),
    existsLodging,
    validateDTO(lodgingDTO.lodgingSchema),
    lodgingController.updateLodging
)

router.put(
    '/:lid/disable',
    authPolicy(['admin']),
    existsLodging,
    lodgingController.disableLodging
)

router.delete(
    '/:lid',
    authPolicy(['admin']),
    existsLodging,
    lodgingController.deleteLodging
)

export default router