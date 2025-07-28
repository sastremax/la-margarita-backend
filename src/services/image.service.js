import { getFactory } from '../dao/factory.js'
import { imageSchema, asPublicImage } from '../dto/image.dto.js'

let imageDAO

const init = async () => {
    if (!imageDAO) {
        const daos = await getFactory()
        imageDAO = daos.ImageDAO
    }
}

export class ImageService {
    static async getAllImages() {
        await init()
        const images = await imageDAO.getAllImages()
        return images.map(asPublicImage)
    }

    static async getImageById(id) {
        const image = await imageDAO.getImageById(id)
        return asPublicImage(image)
    }

    static async getImagesByLodgingId(lodgingId) {
        const images = await imageDAO.getImagesByLodgingId(lodgingId)
        return images.map(asPublicImage)
    }

    static async uploadImage(imageData) {
        const validated = imageSchema.parse(imageData)

        const dbImage = {
            url: validated.url,
            name: validated.name,
            associatedType: validated.type,
            associatedId: validated.refId,
            public_id: validated.publicId || null
        }

        const image = await imageDAO.uploadImage(dbImage)
        return asPublicImage(image)
    }

    static async deleteImage(id) {
        return await imageDAO.deleteImage(id)
    }
}
