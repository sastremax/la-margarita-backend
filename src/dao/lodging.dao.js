import LodgingModel from '../models/lodging.model.js'

class LodgingDAO {
    async getAllLodgings() {
        return await LodgingModel.find()
    }

    async getLodgingById(id) {
        return await LodgingModel.findById(id)
    }

    async createLodging(lodgingData) {
        return await LodgingModel.create(lodgingData)
    }

    async updateLodging(id, updateData) {
        return await LodgingModel.findByIdAndUpdate(id, updateData, { new: true })
    }

    async deleteLodging(id) {
        return await LodgingModel.findByIdAndDelete(id)
    }
}

export default LodgingDAO
