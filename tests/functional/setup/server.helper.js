import { app } from '../../../src/appExpress.js'
import { connectToDB } from '../../../src/config/db.js'
import passport from 'passport'
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'
import { config } from '../../../src/config/index.js'
import User from '../../../src/models/user.model.js'

let ready = false

const buildStrategy = () => {
    const extractors = [
        req => (req && req.cookies && req.cookies.token) ? req.cookies.token : null,
        ExtractJwt.fromAuthHeaderAsBearerToken()
    ]
    const opts = { jwtFromRequest: ExtractJwt.fromExtractors(extractors), secretOrKey: config.jwt.secret }
    const verify = async (payload, done) => {
        try {
            const user = await User.findById(payload.id)
            if (!user) return done(null, false)
            return done(null, { id: user._id.toString(), role: user.role })
        } catch (e) {
            return done(e, false)
        }
    }
    return new JwtStrategy(opts, verify)
}

export const getServer = async () => {
    if (!ready) {
        await connectToDB()
        const strategy = buildStrategy()
        passport.use('jwt', strategy)
        passport.use('jwt-bearer', buildStrategy())
        app.use(passport.initialize())
        ready = true
    }
    return app
}

export const getSupertestTarget = getServer
