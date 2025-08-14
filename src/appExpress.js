import cookieParser from 'cookie-parser'
import express from 'express'
import { logger } from './config/logger.js'
import { securityMiddleware } from './middlewares/security.middleware.js'
import { corsMiddleware } from './middlewares/corsConfig.middleware.js'
import { limiter } from './middlewares/envRateLimiter.js'
import { sanitizeMiddleware } from './middlewares/sanitize.middleware.js'
import { trimBody } from './middlewares/trimBody.middleware.js'
import { notFound } from './middlewares/notFound.middleware.js'
import { errorHandler } from './middlewares/errorHandler.middleware.js'
import { router } from './routes/index.js'
import { loggerMiddleware } from './middlewares/logger.middleware.js'
import { csrfMiddleware } from './middlewares/csrf.middleware.js'
import { swaggerUiInstance, specs } from './config/swagger.config.js'
import { config } from './config/index.js'
import { auditLogger } from './middlewares/auditLogger.js'

export const app = express()

app.use(cookieParser())
app.use(loggerMiddleware)
app.use(auditLogger)
app.use(securityMiddleware)
app.use(corsMiddleware)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(trimBody)
app.use(sanitizeMiddleware)
app.use(limiter)
app.use(csrfMiddleware)

if (config.mode !== 'test') {
    app.use('/apidocs', swaggerUiInstance.serve, swaggerUiInstance.setup(specs))
}

app.use('/api', router)

app.use(notFound)
app.use(errorHandler)

logger.debug('Express app initialized')
