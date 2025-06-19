import winston from 'winston'
import { customLevels } from './customLevels.js'

const prodLogger = winston.createLogger({
    levels: customLevels.levels,
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/errors.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
})

export default prodLogger
