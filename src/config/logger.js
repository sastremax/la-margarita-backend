import config from './index.js'
import { addColors } from 'winston/lib/winston/config/index.js'
import { customLevels } from './customLevels.js'
import devLogger from './devLogger.js'
import prodLogger from './prodLogger.js'

const { nodeEnv, logLevel } = config

addColors(customLevels.colors)

const logger =
    nodeEnv === 'production' ? prodLogger : devLogger

logger.level = logLevel

export default logger