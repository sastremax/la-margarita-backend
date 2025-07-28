import { LodgingDAO } from '../dao/lodging.dao.js'

const lodgingDAO = new LodgingDAO()

export const existsLodging = async (req, res, next) => {
    const lodging = await lodgingDAO.getLodgingById(req.params.lid)
    if (!lodging) {
        return res.status(404).json({ status: 'error', error: 'Lodging not found' })
    }
    req.lodging = lodging
    next()
}
