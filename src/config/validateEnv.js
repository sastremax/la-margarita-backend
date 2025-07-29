const requiredVariables = [
    'PORT',
    'MONGO_URI',
    'JWT_SECRET',
    'JWT_EXPIRES',
    'MAIL_USER',
    'MAIL_PASS',
    'CORS_ORIGIN',
    'LOG_LEVEL'
]

const missing = requiredVariables.filter(name => !process.env[name])

if (missing.length > 0) {
    console.error(`Missing environment variables: ${missing.join(', ')}`)
    process.exit(1)
}
