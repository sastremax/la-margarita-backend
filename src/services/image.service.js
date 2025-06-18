import ImageDAO from '../dao/image.dao.js'

class ImageService {
    static async getAllImages() {
        return await ImageDAO.getAllImages()
    }

    static async getImageById(id) {
        return await ImageDAO.getImageById(id)
    }

    static async getImagesByLodgingId(lodgingId) {
        return await ImageDAO.getImagesByLodgingId(lodgingId)
    }

    static async uploadImage(imageData) {
        return await ImageDAO.uploadImage(imageData)
    }

    static async deleteImage(id) {
        return await ImageDAO.deleteImage(id)
    }
}

export default ImageService
