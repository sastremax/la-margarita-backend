import lodgingService from '../services/lodging.service.js'

export async function getHouses(req, res, next) {
    try {
        const filters = req.query
        const houses = await lodgingService.getAllHouses(filters)
        res.status(200).json({ status: 'success', data: houses })
    } catch (error) {
        next(error)
    }
}

export async function getHouse(req, res, next) {
    try {
        const { id } = req.params
        const house = await lodgingService.getHouseById(id)
        res.status(200).json({ status: 'success', data: house })
    } catch (error) {
        next(error)
    }
}

export async function postHouse(req, res, next) {
    try {
        const houseData = req.body
        const house = await lodgingService.createHouse(houseData)
        res.status(201).json({ status: 'success', data: house })
    } catch (error) {
        next(error)
    }
}
