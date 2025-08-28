import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const pkg = require('../../package.json')

const cleanPath = url => {
    const u = typeof url === 'string' ? url.split('?')[0] : ''
    return u.endsWith('/') && u !== '/' ? u.slice(0, -1) : u
}

export const mountHealth = (app, base = '') => {
    const basePath = cleanPath(base)
    const rootPath = basePath === '' ? '/' : `${basePath}/`
    const versionPath = `${basePath}/version`

    const mw = (req, res, next) => {
        const url = cleanPath(req?.path || req?.originalUrl || req?.url || '')
        if ((url === basePath || url === rootPath) && (req.method === 'GET' || req.method === 'HEAD')) {
            if (req.method === 'HEAD') return res.sendStatus(200)
            return res.status(200).json({ status: 'ok' })
        }
        if (url === versionPath && req.method === 'GET') {
            return res.status(200).json({ name: pkg.name, version: pkg.version })
        }
        if (typeof next === 'function') return next()
    }

    app.use(mw)
}
