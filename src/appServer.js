import mongoose from 'mongoose';
import config from './config/index.js';
import logger from './utils/logger.js';
import app from './app.js';

const startServer = async () => {
    try {
        await mongoose.connect(config.mongoUri);
        logger.info('Connected to MongoDB');

        app.listen(config.port, () => {
            logger.info(`Server listening on port ${config.port}`);
        });
    } catch (err) {
        logger.error('Failed to start server');
        logger.error(err);
        process.exit(1);
    }
};

startServer();

