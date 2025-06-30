import dotenv from 'dotenv'
dotenv.config({ path: '.env.test' })

import * as chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
global.expect = chai.expect