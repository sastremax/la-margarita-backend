import { logger } from './config/logger.js'
import { config } from './config/index.js'
import startServer from './appServer.js'

const dbName = config.mongoUri.split('/').pop().split('?')[0]

logger.info(`Starting app.js - PID ${process.pid}`)
logger.info(`NODE_ENV: ${config.nodeEnv}`)
logger.info(`MongoDB Database: ${dbName}`)

startServer()
    .then(() => {
        logger.info('Server started successfully')
    })
    .catch((err) => {
        logger.fatal('Failed to start server')
        logger.fatal(err)
        process.exit(1)
    })

