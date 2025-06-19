import express from 'express'
import securityMiddleware from './middlewares/security.middleware.js'
import corsConfig from './middlewares/corsConfig.middleware.js'
import requestLogger from './middlewares/requestLogger.middleware.js'
import rateLimit from './middlewares/rateLimit.middleware.js'
import sanitize from './middlewares/sanitize.middleware.js'
import trimBody from './middlewares/trimBody.middleware.js'
import notFound from './middlewares/notFound.middleware.js'
import errorHandler from './middlewares/errorHandler.middleware.js'
import router from './routes/index.js'

const app = express()

app.use(securityMiddleware)
app.use(corsConfig)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(trimBody)
app.use(sanitize)
app.use(requestLogger)
app.use(rateLimit)

app.use('/api', router)

app.use(notFound)
app.use(errorHandler)

export default app
