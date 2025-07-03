import LodgingModel from '../models/lodging.model.js'

class LodgingDAO {
    async getAllLodgings(filters = {}) {
        const query = {}

        if (filters.city) {
            query['location.city'] = filters.city
        }

        if (filters.province) {
            query['location.province'] = filters.province
        }

        if (filters.country) {
            query['location.country'] = filters.country
        }

        if (filters.isActive !== undefined) {
            query.isActive = filters.isActive === 'true'
        }

        if (filters.capacity) {
            query.capacity = { $gte: parseInt(filters.capacity) }
        }

        return await LodgingModel.find(query)
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
