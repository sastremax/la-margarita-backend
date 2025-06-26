import LodgingDAO from '../dao/lodging.dao.js'
import asLodgingPublic from '../dto/lodging.dto.js'

const lodgingDAO = new LodgingDAO()

class LodgingService {
    static async getAllLodgings() {
        const lodgings = await lodgingDAO.getAllLodgings()
        return lodgings.map(asLodgingPublic)
    }

    static async getLodgingById(id) {
        const lodging = await lodgingDAO.getLodgingById(id)
        return asLodgingPublic(lodging)
    }

    static async createLodging(lodgingData) {
        const lodging = await lodgingDAO.createLodging(lodgingData)
        return asLodgingPublic(lodging)
    }

    static async updateLodging(id, updateData) {
        const lodging = await lodgingDAO.updateLodging(id, updateData)
        return asLodgingPublic(lodging)
    }

    static async deleteLodging(id) {
        return await lodgingDAO.deleteLodging(id)
    }
}

export default LodgingService