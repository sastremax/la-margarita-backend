import { createLogger, format, transports } from 'winston';
import config from '../config/index.js';

const { combine, timestamp, printf, colorize, errors } = format;

const logFormat = printf((info) => {
    const ts = typeof info.timestamp === 'string' ? info.timestamp : '';
    const lvl = String(info.level);

    let msg;
    if (typeof info.stack === 'string') {
        msg = info.stack;
    } else if (typeof info.message === 'string') {
        msg = info.message;
    } else {
        msg = JSON.stringify(info.message);
    }

    return `${ts} [${lvl}]: ${msg}`;
});

const devLogger = createLogger({
    level: 'debug',
    format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        logFormat
    ),
    transports: [new transports.Console()],
});

const prodLogger = createLogger({
    level: 'info',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        logFormat
    ),
    transports: [
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' }),
    ],
});

const logger = config.nodeEnv === 'production' ? prodLogger : devLogger;

export default logger;
