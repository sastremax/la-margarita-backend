import ImageModel from '../models/image.model.js'

class ImageDAO {
    static async getAllImages() {
        return await ImageModel.find()
    }

    static async getImageById(id) {
        return await ImageModel.findById(id)
    }

    static async getImagesByLodgingId(lodgingId) {
        return await ImageModel.find({ lodging: lodgingId })
    }

    static async uploadImage(imageData) {
        return await ImageModel.create(imageData)
    }

    static async deleteImage(id) {
        return await ImageModel.findByIdAndDelete(id)
    }
}

export default ImageDAO
