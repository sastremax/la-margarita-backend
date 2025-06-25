import winston from 'winston'
import customLevels from './customLevels.js'

const { combine, timestamp, printf, errors } = winston.format

const logFormat = printf((info) => {
    const ts = typeof info.timestamp === 'string' ? info.timestamp : ''
    const lvl = String(info.level)

    let msg
    if (typeof info.stack === 'string') {
        msg = info.stack
    } else if (typeof info.message === 'string') {
        msg = info.message
    } else {
        msg = JSON.stringify(info.message)
    }

    return `${ts} [${lvl}]: ${msg}`
})

const prodLogger = winston.createLogger({
    levels: customLevels.levels,
    level: 'info',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        logFormat
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
})

export default prodLogger
