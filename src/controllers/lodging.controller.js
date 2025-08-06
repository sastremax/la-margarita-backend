import { lodgingSchema } from '../dto/lodging.dto.js'
import { lodgingFiltersSchema } from '../dto/lodgingFilters.dto.js'
import { AuditService } from '../services/audit.service.js'
import { LodgingService } from '../services/lodging.service.js'
import { ApiError } from '../utils/apiError.js'

export const getAllLodgings = async (req, res, next) => {
    try {
        const parseResult = lodgingFiltersSchema.safeParse(req.query)
        if (!parseResult.success) {
            throw new ApiError(400, 'Invalid query filters')
        }

        const lodgings = await LodgingService.getAllLodgings(parseResult.data)
        res.status(200).json({ status: 'success', data: lodgings })
    } catch (error) {
        next(error)
    }
}

export const getLodgingById = async (req, res, next) => {
    try {
        const { lid } = req.params
        const lodging = await LodgingService.getLodgingById(lid)

        if (!lodging) throw new ApiError(404, 'Lodging not found')

        res.status(200).json({ status: 'success', data: lodging })
    } catch (error) {
        next(error)
    }
}

export const getLodgingsByOwner = async (req, res, next) => {
    try {
        const { uid } = req.params
        const lodgings = await LodgingService.getLodgingsByOwner(uid)
        res.status(200).json({ status: 'success', data: lodgings })
    } catch (error) {
        next(error)
    }
}

export const createLodging = async (req, res, next) => {
    try {
        const parseResult = lodgingSchema.safeParse(req.body)
        if (!parseResult.success) {
            throw new ApiError(400, 'Invalid lodging data')
        }

        const lodging = await LodgingService.createLodging(parseResult.data)
        res.status(201).json({ status: 'success', data: lodging })
    } catch (error) {
        next(error)
    }
}

export const updateLodging = async (req, res, next) => {
    try {
        const { lid } = req.params
        const parseResult = lodgingSchema.partial().safeParse(req.body)
        if (!parseResult.success) {
            throw new ApiError(400, 'Invalid lodging data')
        }

        if (!req.user?._id) {
            throw new ApiError(401, 'Unauthorized')
        }

        const updated = await LodgingService.updateLodging(lid, parseResult.data)

        if (!updated) throw new ApiError(404, 'Lodging not found')

        await AuditService.logEvent({
            userId: req.user._id,
            event: 'update_lodging',
            success: true,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        })

        res.status(200).json({ status: 'success', data: updated })
    } catch (error) {
        next(error)
    }
}

export const disableLodging = async (req, res, next) => {
    try {
        const { lid } = req.params
        const updated = await LodgingService.disableLodging(lid)

        if (!updated) throw new ApiError(404, 'Lodging not found')

        res.status(200).json({ status: 'success', data: updated })
    } catch (error) {
        next(error)
    }
}

export const deleteLodging = async (req, res, next) => {
    try {
        const { lid } = req.params
        const deleted = await LodgingService.deleteLodging(lid)

        if (!deleted) throw new ApiError(404, 'Lodging not found')

        res.status(204).end()
    } catch (error) {
        next(error)
    }
}
