import LodgingService from '../services/lodging.service.js'

const getAllLodgings = async (req, res, next) => {
    try {
        const filters = req.query
        const lodgings = await LodgingService.getAllLodgings(filters)
        res.status(200).json({ status: 'success', data: lodgings })
    } catch (error) {
        next(error)
    }
}

const getLodgingById = async (req, res, next) => {
    try {
        const { lid } = req.params
        const lodging = await LodgingService.getLodgingById(lid)
        res.status(200).json({ status: 'success', data: lodging })
    } catch (error) {
        next(error)
    }
}

const createLodging = async (req, res, next) => {
    try {
        const lodgingData = req.body
        const lodging = await LodgingService.createLodging(lodgingData)
        res.status(201).json({ status: 'success', data: lodging })
    } catch (error) {
        next(error)
    }
}

const updateLodging = async (req, res, next) => {
    try {
        const { lid } = req.params
        const data = req.body
        const updated = await LodgingService.updateLodging(lid, data)
        res.status(200).json({ status: 'success', data: updated })
    } catch (error) {
        next(error)
    }
}

const deleteLodging = async (req, res, next) => {
    try {
        const { lid } = req.params
        await LodgingService.deleteLodging(lid)
        res.status(204).end()
    } catch (error) {
        next(error)
    }
}

export default {
    getAllLodgings,
    getLodgingById,
    createLodging,
    updateLodging,
    deleteLodging
}