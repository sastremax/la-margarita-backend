import mongoose from 'mongoose'
import { config } from './index.js'
import { logger } from './logger.js'

export const connectToDB = async () => {
    try {
        await mongoose.connect(config.mongoUri)
        logger.info('MongoDB connected')
    } catch (error) {
        logger.fatal('DB connection error:', error)
        process.exit(1)
    }
}
