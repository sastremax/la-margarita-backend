import dotenv from 'dotenv'
dotenv.config({ path: '.env.test' })

import mongoose from 'mongoose'
import config from '../src/config/index.js'

import * as chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
global.expect = chai.expect

before(async () => {
    await mongoose.connect(config.mongoUri)
})

after(async () => {
    await mongoose.connection.close()
})
