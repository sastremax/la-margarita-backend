import winston from 'winston'

const testLogger = winston.createLogger({
    transports: [
        new winston.transports.Console({ silent: true })
    ]
})

export default testLogger