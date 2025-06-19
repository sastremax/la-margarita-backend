import imageService from '../services/image.service.js'

export async function uploadImage(req, res, next) {
    try {
        const image = await imageService.uploadImage(req.file)
        res.status(201).json({ status: 'success', data: image })
    } catch (error) {
        next(error)
    }
}

export async function deleteImage(req, res, next) {
    try {
        await imageService.deleteImage(req.params.id)
        res.status(204).end()
    } catch (error) {
        next(error)
    }
}
