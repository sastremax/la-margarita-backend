import { expect } from 'chai'
import jwt from 'jsonwebtoken'
import tokenService from '../../../src/services/token.service.js'
import config from '../../../src/config/index.js'

describe('Token Service', () => {
    const mockUser = {
        _id: '64a4b6f1c2e5f1a1b2c3d4e5',
        role: 'admin'
    }

    const accessPayload = {
        id: mockUser._id,
        role: mockUser.role
    }

    const refreshPayload = {
        id: mockUser._id
    }

    describe('generateAccessToken', () => {
        it('debería generar un access token JWT válido con ID y role', () => {
            const token = tokenService.generateAccessToken(accessPayload)
            const decoded = jwt.verify(token, config.jwt.secret)

            expect(decoded).to.have.property('id', mockUser._id)
            expect(decoded).to.have.property('role', mockUser.role)
        })
    })

    describe('generateRefreshToken', () => {
        it('debería generar un refresh token JWT válido con solo el ID', () => {
            const token = tokenService.generateRefreshToken(refreshPayload)
            const decoded = jwt.verify(token, config.jwt.refreshSecret)

            expect(decoded).to.have.property('id', mockUser._id)
            expect(decoded).to.not.have.property('role')
        })
    })

    describe('verifyAccessToken', () => {
        it('debería verificar un access token válido y devolver el payload', () => {
            const token = tokenService.generateAccessToken(accessPayload)
            const payload = tokenService.verifyAccessToken(token)

            expect(payload).to.have.property('id', mockUser._id)
            expect(payload).to.have.property('role', mockUser.role)
        })

        it('debería lanzar un error si el token es inválido', () => {
            const fakeToken = 'invalid.token.here'
            expect(() => tokenService.verifyAccessToken(fakeToken)).to.throw()
        })
    })

    describe('verifyRefreshToken', () => {
        it('debería verificar un refresh token válido y devolver el payload', () => {
            const token = tokenService.generateRefreshToken(refreshPayload)
            const payload = tokenService.verifyRefreshToken(token)

            expect(payload).to.have.property('id', mockUser._id)
            expect(payload).to.not.have.property('role')
        })
    })
})

