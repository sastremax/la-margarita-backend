import dotenvFlow from 'dotenv-flow'
import mongoose from 'mongoose'
import app from './app.js'

dotenvFlow.config()

const PORT = process.env.PORT || 3000
const MONGO_URI = process.env.MONGO_URI

if (!MONGO_URI) {
    console.error('MONGO_URI is not defined in environment variables')
    process.exit(1)
}

mongoose
    .connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Connected to MongoDB')
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT} [${process.env.NODE_ENV}]`)
        })
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error)
        process.exit(1)
    })
