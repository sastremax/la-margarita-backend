import mongoose from 'mongoose'
import config from './index.js'

async function connectToDB() {
    try {
        await mongoose.connect(config.mongoUri)
        console.log('MongoDB connected')
    } catch (error) {
        console.error('DB connection error:', error)
        process.exit(1)
    }
}

export default connectToDB