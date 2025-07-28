import { LodgingService } from '../services/lodging.service.js'
import { asPublicLodging } from '../dto/lodging.dto.js'
import { AuditService } from '../services/audit.service.js'

export const getAllLodgings = async (req, res, next) => {
    try {
        const filters = req.query
        const lodgings = await LodgingService.getAllLodgings(filters)
        const publicLodgings = lodgings.map(asPublicLodging)
        res.status(200).json({ status: 'success', data: publicLodgings })
    } catch (error) {
        next(error)
    }
}

export const getLodgingById = async (req, res, next) => {
    try {
        const { lid } = req.params
        const lodging = await LodgingService.getLodgingById(lid)
        res.status(200).json({ status: 'success', data: asPublicLodging(lodging) })
    } catch (error) {
        next(error)
    }
}

export const getLodgingsByOwner = async (req, res, next) => {
    try {
        const { uid } = req.params
        const lodgings = await LodgingService.getLodgingsByOwner(uid)
        const data = lodgings.map(asPublicLodging)
        res.status(200).json({ status: 'success', data })
    } catch (error) {
        next(error)
    }
}

export const createLodging = async (req, res, next) => {
    try {
        const lodgingData = req.body
        const lodging = await LodgingService.createLodging(lodgingData)
        res.status(201).json({ status: 'success', data: asPublicLodging(lodging) })
    } catch (error) {
        next(error)
    }
}

export const updateLodging = async (req, res, next) => {
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

        res.status(200).json({ status: 'success', data: asPublicLodging(updated) })
    } catch (error) {
        next(error)
    }
}

export const disableLodging = async (req, res, next) => {
    try {
        const { lid } = req.params
        const updated = await LodgingService.disableLodging(lid)
        res.status(200).json({ status: 'success', data: asPublicLodging(updated) })
    } catch (error) {
        next(error)
    }
}

export const deleteLodging = async (req, res, next) => {
    try {
        const { lid } = req.params
        await LodgingService.deleteLodging(lid)
        res.status(204).end()
    } catch (error) {
        next(error)
    }
}
