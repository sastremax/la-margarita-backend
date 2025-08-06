import { ImageService } from '../services/image.service.js'

export const uploadImage = async (req, res, next) => {
    try {
        const image = await ImageService.uploadImage(req.body)
        res.status(201).json({ status: 'success', data: image })
    } catch (error) {
        next(error)
    }
}

export const getAllImages = async (req, res, next) => {
    try {
        const images = await ImageService.getAllImages()
        res.status(200).json({ status: 'success', data: images })
    } catch (error) {
        next(error)
    }
}

export const getImageById = async (req, res, next) => {
    try {
        const image = await ImageService.getImageById(req.params.id)
        if (!image) {
            return res.status(404).json({ status: 'error', message: 'Image not found' })
        }
        res.status(200).json({ status: 'success', data: image })
    } catch (error) {
        next(error)
    }
}

export const getImagesByLodgingId = async (req, res, next) => {
    try {
        const images = await ImageService.getImagesByLodgingId(req.params.lodgingId)
        res.status(200).json({ status: 'success', data: images })
    } catch (error) {
        next(error)
    }
}

export const deleteImage = async (req, res, next) => {
    try {
        const result = await ImageService.deleteImage(req.params.id)
        if (!result) {
            return res.status(404).json({ status: 'error', message: 'Image not found' })
        }
        res.status(200).json({ status: 'success', message: 'Image deleted' })
    } catch (error) {
        next(error)
    }
}
