import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised').default

chai.use(chaiAsPromised)
global.expect = chai.expect




