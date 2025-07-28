import { ImageModel } from '../models/image.model.js'

export class ImageDAO {
    async getAllImages() {
        return await ImageModel.find()
    }

    async getImageById(id) {
        return await ImageModel.findById(id)
    }

    async getImagesByLodgingId(lodgingId) {
        return await ImageModel.find({ associatedId: lodgingId, associatedType: 'lodging' })
    }

    async uploadImage(imageData) {
        return await ImageModel.create(imageData)
    }

    async deleteImage(id) {
        return await ImageModel.findByIdAndDelete(id)
    }
}
