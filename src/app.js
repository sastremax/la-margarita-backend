import cluster from 'cluster'
import os from 'os'
import { logger } from './config/logger.js'

const numCPUs = os.cpus().length

if (cluster.isPrimary) {
    logger.info(`Primary process PID ${process.pid} is running`)
    logger.info(`Launching ${numCPUs} worker(s)`)

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
    }

    cluster.on('exit', (worker, code, signal) => {
        logger.warn(`Worker ${worker.process.pid} exited`)
        logger.info('Spawning a new worker...')
        cluster.fork()
    })
} else {
    logger.info(`Worker PID ${process.pid} started`)
    await import('./appServer.js')
}
