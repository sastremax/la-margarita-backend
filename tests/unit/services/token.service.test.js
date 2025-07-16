import { expect } from 'chai'
import sinon from 'sinon'
import jwt from 'jsonwebtoken'
import tokenService from '../../../src/services/token.service.js'
import config from '../../../src/config/index.js'
import ApiError from '../../../src/utils/apiError.js'

describe('Token Service', () => {
    const payload = { id: 'user1', role: 'user' }

    afterEach(() => {
        sinon.restore()
    })

    it('should generate a valid access token', () => {
        const token = tokenService.generateAccessToken(payload)
        const decoded = jwt.verify(token, config.jwt.secret)
        expect(decoded).to.include({ id: 'user1', role: 'user' })
    })

    it('should generate a valid refresh token', () => {
        const token = tokenService.generateRefreshToken(payload)
        const decoded = jwt.verify(token, config.jwt.refreshSecret)
        expect(decoded).to.include({ id: 'user1', role: 'user' })
    })

    it('should verify a valid access token', () => {
        const token = jwt.sign(payload, config.jwt.secret, { expiresIn: '1h' })
        const verified = tokenService.verifyAccessToken(token)
        expect(verified).to.include({ id: 'user1', role: 'user' })
    })

    it('should verify a valid refresh token', () => {
        const token = jwt.sign(payload, config.jwt.refreshSecret, { expiresIn: '7d' })
        const verified = tokenService.verifyRefreshToken(token)
        expect(verified).to.include({ id: 'user1', role: 'user' })
    })

    it('should throw error if access secret is missing', () => {
        sinon.stub(config.jwt, 'secret').value(undefined)
        expect(() => tokenService.generateAccessToken(payload)).to.throw(ApiError)
    })

    it('should throw error if refresh secret is missing', () => {
        sinon.stub(config.jwt, 'refreshSecret').value(undefined)
        expect(() => tokenService.generateRefreshToken(payload)).to.throw(ApiError)
    })

    it('should throw on invalid access token', () => {
        const badToken = 'invalid.token'
        expect(() => tokenService.verifyAccessToken(badToken)).to.throw()
    })

    it('should throw on invalid refresh token', () => {
        const badToken = 'invalid.token'
        expect(() => tokenService.verifyRefreshToken(badToken)).to.throw()
    })
})