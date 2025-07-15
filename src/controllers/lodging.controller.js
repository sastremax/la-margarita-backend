import LodgingService from '../services/lodging.service.js'
import lodgingDTO from '../dto/lodging.dto.js'
import AuditService from '../services/audit.service.js'

const getAllLodgings = async (req, res, next) => {
    try {
        const filters = req.query
        const lodgings = await LodgingService.getAllLodgings(filters)
        const publicLodgings = lodgings.map(lodgingDTO.asPublicLodging)
        res.status(200).json({ status: 'success', data: publicLodgings })
    } catch (error) {
        next(error)
    }
}

const getLodgingById = async (req, res, next) => {
    try {
        const { lid } = req.params
        const lodging = await LodgingService.getLodgingById(lid)
        res.status(200).json({ status: 'success', data: lodgingDTO.asPublicLodging(lodging) })
    } catch (error) {
        next(error)
    }
}

const getLodgingsByOwner = async (req, res, next) => {
    try {
        const { uid } = req.params
        const lodgings = await LodgingService.getLodgingsByOwner(uid)
        const data = lodgings.map(lodgingDTO.asPublicLodging)
        res.status(200).json({ status: 'success', data })
    } catch (error) {
        next(error)
    }
}

const createLodging = async (req, res, next) => {
    try {
        const lodgingData = req.body
        const lodging = await LodgingService.createLodging(lodgingData)
        res.status(201).json({ status: 'success', data: lodgingDTO.asPublicLodging(lodging) })
    } catch (error) {
        next(error)
    }
}

const updateLodging = async (req, res, next) => {
    try {
        const { lid } = req.params
        const data = req.body
        const updated = await LodgingService.updateLodging(lid, data)

        await AuditService.logEvent({
            userId: req.user._id,
            event: 'update_lodging',
            success: true,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        })

        res.status(200).json({ status: 'success', data: lodgingDTO.asPublicLodging(updated) })
    } catch (error) {
        next(error)
    }
}

const disableLodging = async (req, res, next) => {
    try {
        const { lid } = req.params
        const updated = await LodgingService.disableLodging(lid)
        res.status(200).json({ status: 'success', data: lodgingDTO.asPublicLodging(updated) })
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
    getLodgingsByOwner,
    createLodging,
    updateLodging,
    disableLodging,
    deleteLodging
}