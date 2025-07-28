import { getFactory } from '../dao/factory.js'
import { asPublicLodging } from '../dto/lodging.dto.js'

let lodgingDAO

const init = async () => {
    if (!lodgingDAO) {
        const daos = await getFactory()
        lodgingDAO = daos.LodgingDAO
    }
}

export class LodgingService {
    static async getAllLodgings(filters = {}) {
        await init()
        const lodgings = await lodgingDAO.getAllLodgings(filters)
        return lodgings.map(asPublicLodging)
    }

    static async getLodgingById(id) {
        await init()
        const lodging = await lodgingDAO.getLodgingById(id)
        return asPublicLodging(lodging)
    }

    static async getLodgingsByOwner(ownerId) {
        await init()
        const lodgings = await lodgingDAO.getLodgingsByOwner(ownerId)
        return lodgings.map(asPublicLodging)
    }

    static async createLodging(lodgingData) {
        await init()
        const lodging = await lodgingDAO.createLodging(lodgingData)
        return asPublicLodging(lodging)
    }

    static async updateLodging(id, updateData) {
        await init()
        const lodging = await lodgingDAO.updateLodging(id, updateData)
        return asPublicLodging(lodging)
    }

    static async disableLodging(id) {
        await init()
        const lodging = await lodgingDAO.disableLodging(id)
        return asPublicLodging(lodging)
    }

    static async deleteLodging(id) {
        await init()
        return await lodgingDAO.deleteLodging(id)
    }
}
