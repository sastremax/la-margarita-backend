import { logger } from '../config/logger.js'

export const safeLogger = (level, message, meta) => {
    const lvl = typeof level === 'string' ? level.toLowerCase() : 'info'
    try {
        if (logger && typeof logger[lvl] === 'function') {
            return meta ? logger[lvl](message, meta) : logger[lvl](message)
        }
        if (logger && typeof logger.log === 'function') {
                return meta ? logger.log(lvl, message, meta) : logger.log(lvl, message)
        }
    } catch (error) {
        console.error(`safeLogger error:`, error);
    }
        return meta ? console.log(`[${lvl}] ${message}`, meta) : console.log(`[${lvl}] ${message}`)
}
