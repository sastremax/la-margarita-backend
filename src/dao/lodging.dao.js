import mongoose from 'mongoose'
import Lodging from '../models/lodging.model.js'

export class LodgingDAO {
    async getAllLodgings(filters = {}) {
        const query = {}

        if (filters.city) query['location.city'] = filters.city
        if (filters.province) query['location.province'] = filters.province
        if (filters.country) query['location.country'] = filters.country
        if (filters.owner) {
            if (!mongoose.Types.ObjectId.isValid(filters.owner)) {
                throw new Error('Invalid owner ID')
            }
            query.owner = filters.owner
        }
        if (filters.isActive !== undefined) {
            if (typeof filters.isActive === 'string') {
                query.isActive = filters.isActive === 'true'
            } else {
                query.isActive = !!filters.isActive
            }
        }
        if (filters.capacity) {
            const parsedCapacity = parseInt(filters.capacity, 10)
            if (!Number.isNaN(parsedCapacity)) {
                query.capacity = { $gte: parsedCapacity }
            }
        }

        return await Lodging.find(query).sort({ createdAt: -1 })
    }

    async getLodgingById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid lodging ID')
        }
        return await Lodging.findById(id)
    }

    async getLodgingsByOwner(ownerId) {
        if (!mongoose.Types.ObjectId.isValid(ownerId)) {
            throw new Error('Invalid owner ID')
        }
        return await Lodging.find({ owner: ownerId })
    }

    async createLodging(lodgingData) {
        return await Lodging.create(lodgingData)
    }

    async updateLodging(id, updateData) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid lodging ID')
        }
        return await Lodging.findByIdAndUpdate(id, updateData, { new: true })
    }

    async disableLodging(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid lodging ID')
        }
        return await Lodging.findByIdAndUpdate(id, { isActive: false }, { new: true })
    }

    async deleteLodging(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid lodging ID')
        }
        return await Lodging.findByIdAndDelete(id)
    }
}
