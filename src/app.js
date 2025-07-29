import cluster from 'node:cluster'
import os from 'node:os'
import { config } from './config/index.js'
import { logger } from './config/logger.js'
import { startServer } from './appServer.js'

const numCPUs = os.cpus().length
const dbName = config.mongoUri.split('/').pop().split('?')[0]

if (cluster.isPrimary) {
    logger.info(`Starting app.js - PID ${process.pid}`)
    logger.info(`NODE_ENV: ${config.nodeEnv}`)
    logger.info(`MongoDB Database: ${dbName}`)
    logger.info(`Primary process is running - launching ${numCPUs} worker(s)`)

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
    }

    cluster.on('exit', (worker) => {
        logger.warn(`Worker ${worker.process.pid} died`)
        cluster.fork()
    })
} else {
    startServer()
        .then(() => {
            logger.info(`Worker ${process.pid} started and server is listening`)
        })
        .catch((err) => {
            logger.fatal('Failed to start server')
            logger.fatal(err)
            process.exit(1)
        })
}
