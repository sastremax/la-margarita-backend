const env = process.env.NODE_ENV || 'development'

const base = ['JWT_SECRET', 'JWT_REFRESH_SECRET', 'JWT_EXPIRES']
const prodOnly = ['PORT', 'MONGO_URI', 'MAIL_USER', 'MAIL_PASS', 'CORS_ORIGIN']
const devOnly = ['MONGO_URI']
const testOnly = ['MONGO_URI_TEST']

let required = [...base]
if (env === 'production') required = [...required, ...prodOnly]
if (env === 'development') required = [...required, ...devOnly]
if (env === 'test') required = [...required, ...testOnly]

const missing = required.filter((k) => !process.env[k])

if (missing.length > 0) {
    console.error(`Missing environment variables: ${missing.join(', ')}`)
    process.exit(1)
}
