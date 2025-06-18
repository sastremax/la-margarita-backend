import dotenv from 'dotenv';
import logger from '../utils/logger.js';

const environment = process.env.NODE_ENV || 'development';

dotenv.config({
    path: `.env.${environment}`,
});

const requiredVariables = ['PORT', 'MONGO_URI', 'SECRET_KEY'];

const missing = requiredVariables.filter((name) => !process.env[name]);

if (missing.length > 0) {
    logger.error(`Missing environment variables: ${missing.join(', ')}`);
    process.exit(1);
}

const config = {
    port: parseInt(process.env.PORT, 10),
    mongoUri: process.env.MONGO_URI,
    secretKey: process.env.SECRET_KEY,
    nodeEnv: environment,
};

export default config;
