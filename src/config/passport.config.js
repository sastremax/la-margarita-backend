import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import config from './index.js'
import UserModel from '../models/user.model.js'

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret
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

export default passport
