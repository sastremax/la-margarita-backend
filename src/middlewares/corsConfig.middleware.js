import cors from 'cors'

const parseList = (value) => (value || '').split(',').map(s => s.trim()).filter(Boolean)

const originFn = (origin, callback) => {
    const whitelist = parseList(process.env.CORS_ORIGIN)
    if (!origin) return callback(null, true)
    if (whitelist.length === 0) return callback(null, true)
    if (whitelist.includes(origin)) return callback(null, true)
    return callback(new Error('Not allowed by CORS'))
}

export const corsMiddleware = cors({
    origin: originFn,
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token']
})
