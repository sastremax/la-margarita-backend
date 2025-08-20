import { config } from './config/index.js'
import { logger } from './config/logger.js'
import { app } from './appExpress.js'
import { connectToDB } from './config/db.js'
import passport from 'passport'
import './config/passport.config.js'

const PORT = config.port

export const startServer = async () => {
    const shouldListen = process.env.NODE_ENV !== 'test' || process.env.FORCE_LISTEN === 'true'
    if (!shouldListen) {
        logger.info('Skipping startServer() in test mode')
        return
    }
    try {
        await connectToDB()
        app.use(passport.initialize())
        app.listen(PORT, () => {
            logger.info(`Server listening on port ${PORT}`)
        })
    } catch (err) {
        logger.fatal('Failed to start server')
        logger.fatal(err)
        process.exit(1)
    }
}
