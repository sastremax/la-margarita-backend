import 'dotenv-flow/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { config as appConfig } from '../src/config/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const out = {
    NODE_ENV: process.env.NODE_ENV || null,
    cwd: process.cwd(),
    scriptDir: __dirname,
    mongoUri: appConfig?.mongoUri || null,
    persistence: appConfig?.persistence || null
}

console.log(JSON.stringify(out, null, 2))
