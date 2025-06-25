import houseService from '../services/house.service.js'

export async function getHouses(req, res, next) {
    try {
        const filters = req.query
        const houses = await houseService.getAllHouses(filters)
        res.status(200).json({ status: 'success', data: houses })
    } catch (error) {
        next(error)
    }
}

export async function getHouse(req, res, next) {
    try {
        const { id } = req.params
        const house = await houseService.getHouseById(id)
        res.status(200).json({ status: 'success', data: house })
    } catch (error) {
        next(error)
    }
}

export async function postHouse(req, res, next) {
    try {
        const houseData = req.body
        const house = await houseService.createHouse(houseData)
        res.status(201).json({ status: 'success', data: house })
    } catch (error) {
        next(error)
    }
}
