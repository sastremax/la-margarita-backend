import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const pkg = require('../../package.json')

export const mountHealth = (app, base = '') => {
    app.get(`${base}/`, (req, res) => {
        res.status(200).json({ status: 'ok' })
    })
    app.head(`${base}/`, (req, res) => {
        res.sendStatus(200)
    })
    app.get(`${base}/version`, (req, res) => {
        res.status(200).json({ name: pkg.name, version: pkg.version })
    })
}
