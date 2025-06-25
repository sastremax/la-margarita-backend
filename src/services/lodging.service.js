import LodgingDAO from '../dao/lodging.dao.js'
const lodgingDAO = new LodgingDAO()

class LodgingService {
    static async getAllLodgings() {
        return await lodgingDAO.getAllLodgings()
    }

    static async getLodgingById(id) {
        return await lodgingDAO.getLodgingById(id)
    }

    static async createLodging(lodgingData) {
        return await lodgingDAO.createLodging(lodgingData)
    }

    static async updateLodging(id, updateData) {
        return await lodgingDAO.updateLodging(id, updateData)
    }

    static async deleteLodging(id) {
        return await lodgingDAO.deleteLodging(id)
    }
}

export default LodgingService
