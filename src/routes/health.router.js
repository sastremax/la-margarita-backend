import { Router } from 'express'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const pkg = require('../../package.json')

export const healthRouter = Router()

healthRouter.get('/', (req, res) => {
    res.status(200).json({ status: 'ok' })
})

healthRouter.head('/', (req, res) => {
    res.sendStatus(200)
})

healthRouter.get('/version', (req, res) => {
    res.status(200).json({ name: pkg.name, version: pkg.version })
})
