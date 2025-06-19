import dotenvFlow from 'dotenv-flow'
import logger from '../utils/logger.js'

dotenvFlow.config()

const requiredVariables = [
    'PORT',
    'MONGO_URI',
    'JWT_SECRET',
    'JWT_EXPIRES',
    'MAIL_USER',
    'MAIL_PASS',
    'CORS_ORIGIN',
    'LOG_LEVEL'
]

const missing = requiredVariables.filter(name => !process.env[name])

if (missing.length > 0) {
    logger.error(`Missing environment variables: ${missing.join(', ')}`)
    process.exit(1)
}

const config = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 4000,
    mongoUri: process.env.MONGO_URI,
    jwt: {
        secret: process.env.JWT_SECRET,
        expires: process.env.JWT_EXPIRES
    },
    mail: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    },
    corsOrigin: process.env.CORS_ORIGIN,
    logLevel: process.env.LOG_LEVEL,
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET
    }
}

export default config
