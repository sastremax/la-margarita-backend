import lodgingService from '../services/lodging.service.js'

export async function getAllLodgings(req, res, next) {
    try {
        const filters = req.query
        const houses = await lodgingService.getAllHouses(filters)
        res.status(200).json({ status: 'success', data: houses })
    } catch (error) {
        next(error)
    }
}

export async function getLodgingById(req, res, next) {
    try {
        const { lid } = req.params
        const house = await lodgingService.getHouseById(lid)
        res.status(200).json({ status: 'success', data: house })
    } catch (error) {
        next(error)
    }
}

export async function createLodging(req, res, next) {
    try {
        const houseData = req.body
        const house = await lodgingService.createHouse(houseData)
        res.status(201).json({ status: 'success', data: house })
    } catch (error) {
        next(error)
    }
}

export async function updateLodging(req, res, next) {
    try {
        const { lid } = req.params
        const data = req.body
        const updated = await lodgingService.updateLodging(lid, data)
        res.status(200).json({ status: 'success', data: updated })
    } catch (error) {
        next(error)
    }
}

export async function deleteLodging(req, res, next) {
    try {
        const { lid } = req.params
        await lodgingService.deleteLodging(lid)
        res.status(204).end()
    } catch (error) {
        next(error)
    }
}