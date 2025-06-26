import imageService from '../services/image.service.js'
import imageDTO from '../dto/image.dto.js'

const uploadImage = async (req, res, next) => {
    try {
        const image = await imageService.uploadImage(req.file)
        res.status(201).json({ status: 'success', data: imageDTO.asPublicImage(image) })
    } catch (error) {
        next(error)
    }
}

const deleteImage = async (req, res, next) => {
    try {
        await imageService.deleteImage(req.params.id)
        res.status(204).end()
    } catch (error) {
        next(error)
    }
}

export default {
    uploadImage,
    deleteImage
}