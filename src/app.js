import express from 'express'
import cors from 'cors'
import router from './routes/index.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', router)
app.get('/ping', (req, res) => {
    res.json({ message: 'pong' })
})

export default app
