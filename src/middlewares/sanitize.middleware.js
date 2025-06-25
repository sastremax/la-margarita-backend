import mongoSanitize from 'express-mongo-sanitize'
import xss from 'xss-clean'

const sanitizeMiddleware = [
    mongoSanitize({
        replaceWith: '_',
        onSanitize: function (req, key) {
        }
    }),
    xss()
]

export default sanitizeMiddleware

