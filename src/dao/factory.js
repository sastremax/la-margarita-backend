import config from '../config/index.js'
import logger from '../config/logger.js'

let initialized = false

let daos = {}

const getFactory = async () => {
    if (initialized) return daos

    const persistence = config.persistence?.toLowerCase()

    if (persistence === 'mongodb') {
        const { default: MongoUserDAO } = await import('./user.dao.js')
        const { default: MongoProductDAO } = await import('./product.dao.js')
        const { default: MongoCartDAO } = await import('./cart.dao.js')
        const { default: MongoReservationDAO } = await import('./reservation.dao.js')
        const { default: MongoReviewDAO } = await import('./review.dao.js')
        const { default: MongoImageDAO } = await import('./image.dao.js')
        const { default: MongoLodgingDAO } = await import('./lodging.dao.js')
        const { default: MongoContactDAO } = await import('./contact.dao.js')

        daos = {
            UserDAO: new MongoUserDAO(),
            ProductDAO: new MongoProductDAO(),
            CartDAO: new MongoCartDAO(),
            ReservationDAO: new MongoReservationDAO(),
            ReviewDAO: new MongoReviewDAO(),
            ImageDAO: new MongoImageDAO(),
            LodgingDAO: new MongoLodgingDAO(),
            ContactDAO: new MongoContactDAO()
        }

        initialized = true
        return daos
    } else {
        logger.error(`Unsupported persistence source: ${persistence}`)
        throw new Error('Unsupported persistence source: ' + persistence)
    }
}

export default getFactory
