import { expect } from 'chai'
import sinon from 'sinon'
import UserService from '../../../src/services/user.service.js'
import UserDAO from '../../../src/dao/user.dao.js'
import asUserPublic from '../../../src/dto/user.dto.js'

describe('User Service', () => {
    const fakeUser = {
        _id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'user',
        cart: null
    }

    const publicUser = {
        id: '1',
        fullName: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        cartId: null
    }

    beforeEach(() => {
        sinon.restore()
    })

    it('should get all users', async () => {
        sinon.stub(UserDAO.prototype, 'getAllUsers').resolves([fakeUser])
        const result = await UserService.getAllUsers()
        expect(result).to.deep.equal([publicUser])
    })

    it('should get user by ID', async () => {
        sinon.stub(UserDAO.prototype, 'getUserById').resolves(fakeUser)
        const result = await UserService.getUserById('1')
        expect(result).to.deep.equal(publicUser)
    })

    it('should get user by email', async () => {
        sinon.stub(UserDAO.prototype, 'getUserByEmail').resolves(fakeUser)
        const result = await UserService.getUserByEmail('john@example.com')
        expect(result).to.deep.equal(publicUser)
    })

    it('should create a new user', async () => {
        sinon.stub(UserDAO.prototype, 'createUser').resolves(fakeUser)
        const result = await UserService.createUser(fakeUser)
        expect(result).to.deep.equal(publicUser)
    })

    it('should update a user', async () => {
        sinon.stub(UserDAO.prototype, 'updateUser').resolves(fakeUser)
        const result = await UserService.updateUser('1', { firstName: 'Jane' })
        expect(result).to.deep.equal(publicUser)
    })

    it('should delete a user', async () => {
        sinon.stub(UserDAO.prototype, 'deleteUser').resolves(true)
        const result = await UserService.deleteUser('1')
        expect(result).to.be.true
    })

    it('should update user role', async () => {
        sinon.stub(UserDAO.prototype, 'updateUserRole').resolves(fakeUser)
        const result = await UserService.updateUserRole('1', 'admin')
        expect(result).to.deep.equal(publicUser)
    })
})