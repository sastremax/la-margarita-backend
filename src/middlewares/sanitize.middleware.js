import mongoSanitize from 'express-mongo-sanitize'
import xss from 'xss-clean'

export default [mongoSanitize(), xss()]
