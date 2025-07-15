import { expect } from 'chai'
import sinon from 'sinon'
import bcrypt from 'bcrypt'
import AuthService from '../../../src/services/auth.service.js'
import AuthDAO from '../../../src/dao/auth.dao.js'
import tokenService from '../../../src/services/token.service.js'
import asUserPublic from '../../../src/dto/user.dto.js'
import ApiError from '../../../src/utils/apiError.js'

const dto = { asUserPublic }

const fakeUser = {
    _id: '1',
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
    password: 'hashedpass',
    role: 'user',
    cart: null
}

const publicUser = {
    id: '1',
    fullName: 'Jane Doe',
    email: 'jane@example.com',
    role: 'user',
    cartId: null
}

describe('Auth Service', () => {
    beforeEach(() => {
        sinon.restore()
    })

    describe('registerUser', () => {
        it('should throw error if user already exists', async () => {
            sinon.stub(AuthDAO.prototype, 'findUserByEmail').resolves(fakeUser)

            try {
                await AuthService.registerUser({
                    firstName: 'Jane',
                    lastName: 'Doe',
                    email: 'jane@example.com',
                    password: '12345678'
                })
            } catch (error) {
                expect(error).to.be.instanceOf(ApiError)
                expect(error.statusCode).to.equal(400)
            }
        })

        it('should register and return public user if not existing', async () => {
            sinon.stub(AuthDAO.prototype, 'findUserByEmail').resolves(null)
            sinon.stub(AuthDAO.prototype, 'createUser').resolves(fakeUser)
            sinon.stub(dto, 'asUserPublic').returns(publicUser)

            const result = await AuthService.registerUser({
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane@example.com',
                password: '12345678'
            })

            expect(result).to.deep.equal(publicUser)
        })
    })

    describe('loginUser', () => {
        it('should throw error if user not found', async () => {
            sinon.stub(AuthDAO.prototype, 'findUserByEmail').resolves(null)

            try {
                await AuthService.loginUser({ email: 'jane@example.com', password: '12345678' })
            } catch (error) {
                expect(error).to.be.instanceOf(ApiError)
                expect(error.statusCode).to.equal(401)
            }
        })

        it('should throw error if password invalid', async () => {
            sinon.stub(AuthDAO.prototype, 'findUserByEmail').resolves(fakeUser)
            sinon.stub(bcrypt, 'compare').resolves(false)

            try {
                await AuthService.loginUser({ email: 'jane@example.com', password: 'wrongpass' })
            } catch (error) {
                expect(error).to.be.instanceOf(ApiError)
                expect(error.statusCode).to.equal(401)
            }
        })

        it('should return token and public user if login successful', async () => {
            sinon.stub(AuthDAO.prototype, 'findUserByEmail').resolves(fakeUser)
            sinon.stub(bcrypt, 'compare').resolves(true)
            sinon.stub(tokenService, 'generateAccessToken').returns('fake-token')
            sinon.stub(dto, 'asUserPublic').returns(publicUser)

            const result = await AuthService.loginUser({ email: 'jane@example.com', password: '12345678' })

            expect(result).to.deep.equal({ token: 'fake-token', user: publicUser })
        })
    })
})