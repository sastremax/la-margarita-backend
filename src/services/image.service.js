import ImageDAO from '../dao/image.dao.js'
import asImagePublic from '../dto/image.dto.js'

class ImageService {
    static async getAllImages() {
        const images = await ImageDAO.getAllImages()
        return images.map(asImagePublic)
    }

    static async getImageById(id) {
        const image = await ImageDAO.getImageById(id)
        return asImagePublic(image)
    }

    static async getImagesByLodgingId(lodgingId) {
        const images = await ImageDAO.getImagesByLodgingId(lodgingId)
        return images.map(asImagePublic)
    }

    static async uploadImage(imageData) {
        const image = await ImageDAO.uploadImage(imageData)
        return asImagePublic(image)
    }

    static async deleteImage(id) {
        return await ImageDAO.deleteImage(id)
    }
}

export default ImageService