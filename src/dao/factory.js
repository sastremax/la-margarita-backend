import config from '../config/index.js'
import logger from '../utils/logger.js'

let UserDAO
let ProductDAO
let CartDAO
let ReservationDAO
let ReviewDAO
let ImageDAO
let LodgingDAO
let ContactDAO

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

    UserDAO = new MongoUserDAO()
    ProductDAO = new MongoProductDAO()
    CartDAO = new MongoCartDAO()
    ReservationDAO = new MongoReservationDAO()
    ReviewDAO = new MongoReviewDAO()
    ImageDAO = new MongoImageDAO()
    LodgingDAO = new MongoLodgingDAO()
    ContactDAO = new MongoContactDAO()
} else {
    logger.error(`Unsupported persistence source: ${persistence}`)
    process.exit(1)
}

export default {
    UserDAO,
    ProductDAO,
    CartDAO,
    ReservationDAO,
    ReviewDAO,
    ImageDAO,
    LodgingDAO,
    ContactDAO
}
