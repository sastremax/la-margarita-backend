import express from 'express'
import * as imageController from '../controllers/image.controller.js'

const router = express.Router()

router.post('/', imageController.uploadImage)
router.delete('/:iid', imageController.deleteImage)

export default router
