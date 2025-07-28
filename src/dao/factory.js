import config from '../config/index.js'
import logger from '../config/logger.js'

let initialized = false

let daos = {}

const getFactory = async () => {
    if (initialized) return daos

    const persistence = config.persistence?.toLowerCase()

    if (persistence === 'mongodb') {
        const MongoUserDAO = (await import('./user.dao.js')).default
        const MongoProductDAO = (await import('./product.dao.js')).default
        const MongoCartDAO = (await import('./cart.dao.js')).default
        const MongoReservationDAO = (await import('./reservation.dao.js')).default
        const MongoReviewDAO = (await import('./review.dao.js')).default
        const MongoImageDAO = (await import('./image.dao.js')).default
        const MongoLodgingDAO = (await import('./lodging.dao.js')).default
        const MongoContactDAO = (await import('./contact.dao.js')).default

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
