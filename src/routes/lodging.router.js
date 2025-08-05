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
import { param } from 'express-validator'
import { validateRequest } from '../middlewares/validateRequest.middleware.js'

const router = express.Router()

router.get('/', getAllLodgings)

router.get(
    '/:lid',
    param('lid').isMongoId().withMessage('Invalid lodging ID'),
    validateRequest,
    existsLodging,
    getLodgingById
)

router.get(
    '/owner/:uid',
    param('uid').isMongoId().withMessage('Invalid user ID'),
    validateRequest,
    authPolicy(['admin', 'user']),
    getLodgingsByOwner
)

router.post(
    '/',
    authPolicy(['admin']),
    validateDTO(lodgingSchema),
    createLodging
)

router.put(
    '/:lid',
    param('lid').isMongoId().withMessage('Invalid lodging ID'),
    validateRequest,
    authPolicy(['admin']),
    existsLodging,
    validateDTO(lodgingSchema),
    updateLodging
)

router.put(
    '/:lid/disable',
    param('lid').isMongoId().withMessage('Invalid lodging ID'),
    validateRequest,
    authPolicy(['admin']),
    existsLodging,
    disableLodging
)

router.delete(
    '/:lid',
    param('lid').isMongoId().withMessage('Invalid lodging ID'),
    validateRequest,
    authPolicy(['admin']),
    existsLodging,
    deleteLodging
)

export { router as lodgingRouter }
