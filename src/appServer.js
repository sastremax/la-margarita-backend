import config from './config/index.js'
import logger from './utils/logger.js'
import app from './app.js'
import { connectToDB } from './config/db.js'
import passport from './config/passport.config.js'

const startServer = async () => {
    try {
        await connectToDB()

        app.use(passport.initialize())

        app.listen(config.port, () => {
            logger.info(`Server listening on port ${config.port}`)
        })
    } catch (err) {
        logger.fatal('Failed to start server')
        logger.fatal(err)
        process.exit(1)
    }
}

startServer()
