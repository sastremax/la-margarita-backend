import express from 'express'
import { param } from 'express-validator'
import {
    createLodging,
    deleteLodging,
    disableLodging,
    getAllLodgings,
    getLodgingById,
    getLodgingsByOwner,
    updateLodging
} from '../controllers/lodging.controller.js'
import { lodgingSchema } from '../dto/lodging.dto.js'
import { authPolicy } from '../middlewares/authPolicy.middleware.js'
import { existsLodging } from '../middlewares/existsLodging.middleware.js'
import { validateDTO } from '../middlewares/validateDTO.middleware.js'
import { validateRequest } from '../middlewares/validateRequest.middleware.js'
import { ApiError } from '../utils/apiError.js'

const router = express.Router()

const ensureSameUserOrAdmin = (req, res, next) => {
    if (req.user?.role === 'admin') return next()
    if (req.user?.id && req.user.id === req.params.uid) return next()
    next(new ApiError(403, 'Access denied'))
}

router.get('/', getAllLodgings)

router.get(
    '/owner/:uid',
    param('uid').isMongoId().withMessage('Invalid user ID'),
    validateRequest,
    authPolicy(['admin', 'user']),
    ensureSameUserOrAdmin,
    getLodgingsByOwner
)

router.get(
    '/:lid',
    param('lid').isMongoId().withMessage('Invalid lodging ID'),
    validateRequest,
    existsLodging,
    getLodgingById
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
