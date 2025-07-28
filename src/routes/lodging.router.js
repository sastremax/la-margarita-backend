import express from 'express'
import {
    getAllLodgings,
    getLodgingById,
    getLodgingsByOwner,
    createLodging,
    updateLodging,
    disableLodging,
    deleteLodging
} from '../controllers/lodging.controller.js'
import { authPolicy } from '../middlewares/authPolicy.middleware.js'
import { validateDTO } from '../middlewares/validateDTO.middleware.js'
import { lodgingSchema } from '../dto/lodging.dto.js'
import { existsLodging } from '../middlewares/existsLodging.middleware.js'

const router = express.Router()

router.get('/', getAllLodgings)
router.get('/:lid', existsLodging, getLodgingById)
router.get('/owner/:uid', authPolicy(['admin', 'user']), getLodgingsByOwner)

router.post(
    '/',
    authPolicy(['admin']),
    validateDTO(lodgingSchema),
    createLodging
)

router.put(
    '/:lid',
    authPolicy(['admin']),
    existsLodging,
    validateDTO(lodgingSchema),
    updateLodging
)

router.put(
    '/:lid/disable',
    authPolicy(['admin']),
    existsLodging,
    disableLodging
)

router.delete(
    '/:lid',
    authPolicy(['admin']),
    existsLodging,
    deleteLodging
)

export { router as lodgingRouter }
