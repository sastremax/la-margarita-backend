import fs from 'node:fs'
import path from 'node:path'
import yaml from 'js-yaml'

const baseDir = path.resolve(process.cwd(), 'src', 'docs', 'swagger')

const loadYaml = p => yaml.load(fs.readFileSync(p, 'utf8'))

const mergeDeep = (t, s) => {
    const o = Array.isArray(t) ? [...t] : { ...t }
    for (const k of Object.keys(s)) {
        if (s[k] && typeof s[k] === 'object' && !Array.isArray(s[k])) {
            o[k] = mergeDeep(o[k] || {}, s[k])
        } else if (Array.isArray(s[k])) {
            o[k] = (o[k] || []).concat(s[k])
        } else {
            o[k] = s[k]
        }
    }
    return o
}

const specBase = loadYaml(path.join(baseDir, 'swagger.base.yaml'))
const security = loadYaml(path.join(baseDir, 'components', 'security.yaml'))

const schemasDir = path.join(baseDir, 'components', 'schemas')
const schemaFiles = fs.readdirSync(schemasDir).filter(f => f.endsWith('.yaml'))
const schemas = schemaFiles.reduce((acc, f) => {
    const y = loadYaml(path.join(schemasDir, f))
    return { ...acc, ...y }
}, {})

const pathsDir = path.join(baseDir, 'paths')
const pathFiles = fs.readdirSync(pathsDir).filter(f => f.endsWith('.yaml'))
const pathsMerged = pathFiles.reduce((acc, f) => {
    const y = loadYaml(path.join(pathsDir, f))
    return mergeDeep(acc, y)
}, {})

export const swaggerSpec = (() => {
    const merged = { ...specBase }
    merged.components = merged.components || {}
    merged.components.schemas = { ...(merged.components.schemas || {}), ...schemas }
    merged.components = mergeDeep(merged.components, security)
    merged.paths = mergeDeep(merged.paths || {}, pathsMerged.paths || {})
    return merged
})()
