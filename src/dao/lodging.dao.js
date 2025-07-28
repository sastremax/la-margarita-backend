import Lodging from '../models/lodging.model.js'

export class LodgingDAO {
    async getAllLodgings(filters = {}) {
        const query = {}

        if (filters.city) query['location.city'] = filters.city
        if (filters.province) query['location.province'] = filters.province
        if (filters.country) query['location.country'] = filters.country
        if (filters.owner) query.owner = filters.owner
        if (filters.isActive !== undefined) query.isActive = filters.isActive === 'true'
        if (filters.capacity) query.capacity = { $gte: parseInt(filters.capacity) }

        return await Lodging.find(query).sort({ createdAt: -1 })
    }

    async getLodgingById(id) {
        return await Lodging.findById(id)
    }

    async getLodgingsByOwner(ownerId) {
        return await Lodging.find({ owner: ownerId })
    }

    async createLodging(lodgingData) {
        return await Lodging.create(lodgingData)
    }

    async updateLodging(id, updateData) {
        return await Lodging.findByIdAndUpdate(id, updateData, { new: true })
    }

    async disableLodging(id) {
        return await Lodging.findByIdAndUpdate(id, { isActive: false }, { new: true })
    }

    async deleteLodging(id) {
        return await Lodging.findByIdAndDelete(id)
    }
}
