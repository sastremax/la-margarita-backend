import express from 'express'
import * as lodgingController from '../controllers/lodging.controller.js'

const router = express.Router()

router.get('/', lodgingController.getAllLodgings)
router.get('/:lid', lodgingController.getLodgingById)
router.post('/', lodgingController.createLodging)
router.put('/:lid', lodgingController.updateLodging)
router.delete('/:lid', lodgingController.deleteLodging)

export default router
