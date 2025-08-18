import dotenv from 'dotenv'

const envPath = process.env.DOTENV_CONFIG_PATH || (process.env.NODE_ENV === 'test' ? '.env.test' : '.env')
dotenv.config({ path: envPath })

export const config = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '4000', 10),
    mongoUri: process.env.MONGODB_URI || process.env.MONGO_URI_TEST || process.env.MONGO_URI || '',
    persistence: (process.env.PERSISTENCE || 'mongodb').toLowerCase(),
    jwt: {
        secret: process.env.JWT_SECRET || '',
        refresh: process.env.JWT_REFRESH_SECRET || '',
        expires: process.env.JWT_EXPIRES || '15m'
    },
    mail: {
        user: process.env.MAIL_USER || '',
        pass: process.env.MAIL_PASS || ''
    },
    corsOrigin: process.env.CORS_ORIGIN || '*',
    logLevel: process.env.LOG_LEVEL || 'info',
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
        apiKey: process.env.CLOUDINARY_API_KEY || '',
        apiSecret: process.env.CLOUDINARY_API_SECRET || ''
    }
}
