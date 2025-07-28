import dotenvFlow from 'dotenv-flow'

dotenvFlow.config()

export const config = {
    mode: process.env.NODE_ENV || 'development',
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 4000,
    mongoUri: process.env.NODE_ENV === 'test' ? process.env.MONGO_URI_TEST : process.env.MONGO_URI,
    persistence: process.env.PERSISTENCE || 'mongodb',
    jwt: {
        secret: process.env.JWT_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
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
