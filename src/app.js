import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/ping', (req, res) => {
    res.json({ message: 'pong' })
})

export default app
