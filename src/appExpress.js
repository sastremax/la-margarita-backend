import express from 'express'
import cookieParser from 'cookie-parser'
import securityMiddleware from './middlewares/security.middleware.js'
import cors from 'cors'
import corsConfig from './middlewares/corsConfig.middleware.js'
import rateLimit from './middlewares/rateLimit.middleware.js'
import sanitize from './middlewares/sanitize.middleware.js'
import trimBody from './middlewares/trimBody.middleware.js'
import notFound from './middlewares/notFound.middleware.js'
import errorHandler from './middlewares/errorHandler.middleware.js'
import router from './routes/index.js'
import logger from './config/logger.js'
import loggerMiddleware from './middlewares/logger.middleware.js'
import swagger from './config/swagger.config.js'
import config from './config/index.js'

const app = express()

app.use(cookieParser())
app.use(loggerMiddleware)
app.use(securityMiddleware)
app.use(cors(corsConfig))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(trimBody)
app.use(sanitize)
app.use(rateLimit)
if (config.mode !== 'test') {
    app.use('/apidocs', swagger.swaggerUi.serve, swagger.swaggerUi.setup(swagger.specs))
}

app.use('/api', router)

app.use(notFound)
app.use(errorHandler)

logger.debug('Express app initialized')

export default app