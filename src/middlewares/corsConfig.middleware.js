import cors from 'cors'
import { originChecker } from './originChecker.js'

export const corsMiddleware = cors({
    origin: originChecker,
    credentials: true
})
