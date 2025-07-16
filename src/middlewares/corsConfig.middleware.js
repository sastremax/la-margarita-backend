import cors from 'cors'
import originChecker from './originChecker.js'

const corsMiddleware = cors({
    origin: originChecker,
    credentials: true
})

export default corsMiddleware