import winston from 'winston'

export const testLogger = winston.createLogger({
    transports: [
        new winston.transports.Console({ silent: true })
    ]
})
