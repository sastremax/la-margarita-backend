import getFactory from '../dao/factory.js'
import imageDTO from '../dto/image.dto.js'

let imageDAO

const init = async () => {
    if (!imageDAO) {
        const daos = await getFactory()
        imageDAO = daos.ImageDAO
    }
}

class ImageService {
    static async getAllImages() {
        await init()
        const images = await imageDAO.getAllImages()
        return images.map(imageDTO.asPublicImage)
    }

    static async getImageById(id) {
        const image = await imageDAO.getImageById(id)
        return imageDTO.asPublicImage(image)
    }

    static async getImagesByLodgingId(lodgingId) {
        const images = await imageDAO.getImagesByLodgingId(lodgingId)
        return images.map(imageDTO.asPublicImage)
    }

    static async uploadImage(imageData) {
        const { url, name, type, refId, publicId } = imageData

        const dbImage = {
            url,
            name,
            associatedType: type,
            associatedId: refId,
            public_id: publicId || null
        }

        const image = await imageDAO.uploadImage(dbImage)
        return imageDTO.asPublicImage(image)
    }

    static async deleteImage(id) {
        return await imageDAO.deleteImage(id)
    }
}

export default ImageService