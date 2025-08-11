import { config } from '../config/index.js'
import { logger } from '../config/logger.js'

let initialized = false
let daos = {}

export const getFactory = async () => {
    if (initialized) return daos

    const persistence = config.persistence?.toLowerCase()

    if (persistence === 'mongodb') {
        const { CartDAO } = await import('./cart.dao.js')
        const { ContactDAO } = await import('./contact.dao.js')
        const { ImageDAO } = await import('./image.dao.js')
        const { LodgingDAO } = await import('./lodging.dao.js')
        const { ProductDAO } = await import('./product.dao.js')
        const { ReservationDAO } = await import('./reservation.dao.js')
        const { ReviewDAO } = await import('./review.dao.js')
        const { UserDAO } = await import('./user.dao.js')

        daos = {
            CartDAO: new CartDAO(),
            ContactDAO: new ContactDAO(),
            ImageDAO: new ImageDAO(),
            LodgingDAO: new LodgingDAO(),
            ProductDAO: new ProductDAO(),
            ReservationDAO: new ReservationDAO(),
            ReviewDAO: new ReviewDAO(),
            UserDAO: new UserDAO()
        }

        initialized = true
        return daos
    } else {
        logger.error(`Unsupported persistence source: ${persistence}`)
        throw new Error(`Unsupported persistence source: ${persistence}`)
    }
}
