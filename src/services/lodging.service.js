import LodgingDAO from '../dao/lodging.dao.js'

class LodgingService {
    static async getAllLodgings() {
        return await LodgingDAO.getAllLodgings()
    }

    static async getLodgingById(id) {
        return await LodgingDAO.getLodgingById(id)
    }

    static async createLodging(lodgingData) {
        return await LodgingDAO.createLodging(lodgingData)
    }

    static async updateLodging(id, updateData) {
        return await LodgingDAO.updateLodging(id, updateData)
    }

    static async deleteLodging(id) {
        return await LodgingDAO.deleteLodging(id)
    }
}

export default LodgingService
