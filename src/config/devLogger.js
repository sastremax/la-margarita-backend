import winston from 'winston'
import customLevels from './customLevels.js'

const { combine, timestamp, printf, colorize, errors } = winston.format

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

const devLogger = winston.createLogger({
    levels: customLevels.levels,
    level: 'debug',
    format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        logFormat
    ),
    transports: [new winston.transports.Console()]
})

export default devLogger
