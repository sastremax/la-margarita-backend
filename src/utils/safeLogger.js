import { logger } from '../config/logger.js'

export const safeLogger = (level, message, meta) => {
    const lvl = typeof level === 'string' ? level.toLowerCase() : 'info'
    const fn =
        lvl === 'error' ? logger.error :
            lvl === 'warn' ? logger.warn :
                lvl === 'debug' ? logger.debug :
                    logger.info
    return meta ? fn(message, meta) : fn(message)
}
