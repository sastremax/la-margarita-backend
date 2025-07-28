import { addColors } from 'winston/lib/winston/config/index.js'
import { customLevels } from './customLevels.js'
import { devLogger } from './devLogger.js'
import { prodLogger } from './prodLogger.js'
import { testLogger } from './testLogger.js'

const nodeEnv = process.env.NODE_ENV || 'dev'
const logLevel = process.env.LOG_LEVEL || 'info'

addColors(customLevels.colors)

export const logger = (() => {
    if (nodeEnv === 'production') return prodLogger
    if (nodeEnv === 'test') return testLogger
    return devLogger
})()

logger.level = logLevel
