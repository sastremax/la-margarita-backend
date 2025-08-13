import mongoose from 'mongoose'
import { beforeAll, afterAll } from 'vitest'
import { config } from '../../../src/config/index.js'

beforeAll(async () => {
    await mongoose.connect(config.mongoUri)
})

afterAll(async () => {
    await mongoose.connection.close()
})

