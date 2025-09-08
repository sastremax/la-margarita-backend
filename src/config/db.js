import mongoose from 'mongoose'
import { config } from './index.js'
import { logger } from './logger.js'

const redact = s => {
    if (!s) return ''
    try {
        const u = new URL(s)
        const auth = u.username ? `${u.username}:***@` : ''
        return `${u.protocol}//${auth}${u.host}${u.pathname}`
    } catch {
        return 'invalid-uri'
    }
}

export const connectToDB = async () => {
    const uri = config.mongoUri
    const isTest = config.nodeEnv === 'test'
    if (!uri) {
        const msg = `Missing Mongo URI for env=${config.nodeEnv}`
        if (isTest) throw new Error(msg)
        logger.fatal(msg)
        process.exit(1)
    }
    try {
        logger.info(`Mongo connecting to ${redact(uri)}`)
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 3000,
            connectTimeoutMS: 3000,
            socketTimeoutMS: 3000,
            maxPoolSize: 10
        })
        logger.info('Mongo connected')
    } catch (err) {
        if (isTest) throw err
        logger.fatal('Mongo connection error', err)
        process.exit(1)
    }
}

export const disconnectFromDB = async () => {
    try {
        await mongoose.disconnect()
    } catch { }
}
