import config from '../config/index.js'
import logger from '../config/logger.js'

let initialized = false

let daos = {}

export const getFactory = async () => {
    if (initialized) return daos

    const persistence = config.persistence?.toLowerCase()

    if (persistence === 'mongodb') {
        const { UserDAO } = await import('./user.dao.js')
        const { ProductDAO } = await import('./product.dao.js')
        const { CartDAO } = await import('./cart.dao.js')
        const { ReservationDAO } = await import('./reservation.dao.js')
        const { ReviewDAO } = await import('./review.dao.js')
        const { ImageDAO } = await import('./image.dao.js')
        const { LodgingDAO } = await import('./lodging.dao.js')
        const { ContactDAO } = await import('./contact.dao.js')

        daos = {
            UserDAO: new UserDAO(),
            ProductDAO: new ProductDAO(),
            CartDAO: new CartDAO(),
            ReservationDAO: new ReservationDAO(),
            ReviewDAO: new ReviewDAO(),
            ImageDAO: new ImageDAO(),
            LodgingDAO: new LodgingDAO(),
            ContactDAO: new ContactDAO()
        }

        initialized = true
        return daos
    } else {
        logger.error(`Unsupported persistence source: ${persistence}`)
        throw new Error('Unsupported persistence source: ' + persistence)
    }
}
