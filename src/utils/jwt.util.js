import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET || 'defaultsecret'

function verifyToken(token) {
    return jwt.verify(token, secret)
}

export default verifyToken

