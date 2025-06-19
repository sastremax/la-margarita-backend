import { nodeEnv, logLevel } from './index.js'
import { addColors } from 'winston/lib/winston/config'
import { customLevels } from './customLevels.js'
import devLogger from './devLogger.js'
import prodLogger from './prodLogger.js'

addColors(customLevels.colors)

const logger =
    nodeEnv === 'production' ? prodLogger : devLogger

logger.level = logLevel

export default logger

