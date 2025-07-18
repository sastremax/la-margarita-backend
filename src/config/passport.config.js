import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import UserModel from '../models/user.model.js'
import config from './index.js'

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwt.secret
}

passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            const user = await UserModel.findById(jwt_payload.id)
            if (!user) return done(null, false)
            return done(null, user)
        } catch (err) {
            return done(err, false)
        }
    })
)

passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await UserModel.findById(id)
        done(null, user)
    } catch (error) {
        done(error)
    }
})

export default passport
