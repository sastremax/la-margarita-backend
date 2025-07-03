import imageService from '../services/image.service.js'

const uploadImage = async (req, res, next) => {
    try {
        const image = await imageService.uploadImage(req.body)
        res.status(201).json({ status: 'success', data: image })
    } catch (error) {
        next(error)
    }
}

const getAllImages = async (req, res, next) => {
    try {
        const images = await imageService.getAllImages()
        res.status(200).json({ status: 'success', data: images })
    } catch (error) {
        next(error)
    }
}

const getImageById = async (req, res, next) => {
    try {
        const image = await imageService.getImageById(req.params.id)
        res.status(200).json({ status: 'success', data: image })
    } catch (error) {
        next(error)
    }
}

const getImagesByLodgingId = async (req, res, next) => {
    try {
        const images = await imageService.getImagesByLodgingId(req.params.lodgingId)
        res.status(200).json({ status: 'success', data: images })
    } catch (error) {
        next(error)
    }
}

const deleteImage = async (req, res, next) => {
    try {
        await imageService.deleteImage(req.params.id)
        res.status(200).json({ status: 'success', message: 'Image deleted' })
    } catch (error) {
        next(error)
    }
}

export default {
    uploadImage,
    getAllImages,
    getImageById,
    getImagesByLodgingId,
    deleteImage
}