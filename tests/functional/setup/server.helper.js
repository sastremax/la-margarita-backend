import { app } from '../../../src/appExpress.js'
import { connectToDB } from '../../../src/config/db.js'
import passport from 'passport'
import '../../../src/config/passport.config.js'

let ready = false

export const getSupertestTarget = async () => {
    if (!ready) {
        await connectToDB()
        app.use(passport.initialize())
        ready = true
    }
    return app
}
