import fs from 'node:fs'
import path from 'node:path'
import yaml from 'js-yaml'
import { swaggerSpec } from '../src/docs/swagger/index.js'

const out = path.resolve(process.cwd(), 'openapi.bundle.yaml')
fs.writeFileSync(out, yaml.dump(swaggerSpec, { noRefs: true }))
