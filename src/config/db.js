import mongoose from 'mongoose'
import config from './index.js'
import logger from './logger.js'

export async function connectToDB() {
    try {
        await mongoose.connect(config.mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        logger.info(`Connected to MongoDB [${config.nodeEnv}]`)
    } catch (error) {
        logger.fatal('Failed to connect to MongoDB')
        logger.fatal(error.message)
        process.exit(1)
    }
}
