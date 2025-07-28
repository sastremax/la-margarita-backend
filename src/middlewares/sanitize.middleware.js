import mongoSanitize from 'express-mongo-sanitize'
import xss from 'xss-clean'

export const sanitizeMiddleware = [
    mongoSanitize({
        replaceWith: '_',
        onSanitize: function (req, key) {
        }
    }),
    xss()
]
