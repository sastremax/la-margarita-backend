import crypto from 'crypto'

const needsCheck = (req) => {
    const m = req.method.toUpperCase()
    return m !== 'GET' && m !== 'HEAD' && m !== 'OPTIONS'
}

const shouldBypass = (req) => {
    if (process.env.NODE_ENV === 'test') return true
    const auth = req.headers?.authorization || ''
    if (auth.toLowerCase().startsWith('bearer ')) return true
    return false
}

const ensureTokenCookie = (req, res) => {
    let token = req.cookies?.['XSRF-TOKEN']
    if (!token) {
        token = crypto.randomBytes(32).toString('hex')
        res.cookie('XSRF-TOKEN', token, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        })
    }
    return token
}

export const csrfMiddleware = (req, res, next) => {
    const cookieToken = ensureTokenCookie(req, res)
    if (!needsCheck(req) || shouldBypass(req)) return next()
    const headerToken = req.headers['x-csrf-token']
    if (typeof headerToken === 'string' && headerToken === cookieToken) return next()
    res.status(403).json({ status: 'error', message: 'Invalid CSRF token' })
}
