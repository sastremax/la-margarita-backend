import express from 'express'
import cookieParser from 'cookie-parser'
import router from './routes/index.js'

const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api', router)

export default app

