import LodgingModel from '../models/lodging.model.js'

class LodgingDAO {
    static async getAllLodgings() {
        return await LodgingModel.find()
    }

    static async getLodgingById(id) {
        return await LodgingModel.findById(id)
    }

    static async createLodging(lodgingData) {
        return await LodgingModel.create(lodgingData)
    }

    static async updateLodging(id, updateData) {
        return await LodgingModel.findByIdAndUpdate(id, updateData, { new: true })
    }

    static async deleteLodging(id) {
        return await LodgingModel.findByIdAndDelete(id)
    }
}

export default LodgingDAO
