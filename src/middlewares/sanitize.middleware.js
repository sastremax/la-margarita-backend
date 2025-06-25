import mongoSanitize from 'express-mongo-sanitize'
import xss from 'xss-clean'

const sanitizeMiddleware = [
    mongoSanitize({
        replaceWith: '_'
    }),
    xss()
]

export default sanitizeMiddleware

