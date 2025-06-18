import LodgingModel from '../models/lodging.model.js'

const createLodging = async (lodgingData) => {
    return await LodgingModel.create(lodgingData)
}

const getAllLodgings = async (filters = {}) => {
    return await LodgingModel.find(filters)
}

const getLodgingById = async (id) => {
    const lodging = await LodgingModel.findById(id)
    if (!lodging) throw new Error('Lodging not found')
    return lodging
}

const updateLodging = async (id, updates) => {
    const lodging = await LodgingModel.findByIdAndUpdate(id, updates, { new: true })
    if (!lodging) throw new Error('Update failed')
    return lodging
}

const deleteLodging = async (id) => {
    const deleted = await LodgingModel.findByIdAndDelete(id)
    if (!deleted) throw new Error('Delete failed')
    return deleted
}

export default {
    createLodging,
    getAllLodgings,
    getLodgingById,
    updateLodging,
    deleteLodging
}
