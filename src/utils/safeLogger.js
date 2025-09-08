import { logger } from '../config/logger.js'

export const safeLogger = (level, message, meta) => {
    const lvl = typeof level === 'string' ? level.toLowerCase() : 'info'
    const fn = logger[lvl] || logger.info
    return meta ? fn(message, meta) : fn(message)
}
