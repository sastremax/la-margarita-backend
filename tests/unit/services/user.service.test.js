import sinon from 'sinon'
import UserService from '../../../src/services/user.service.js'
import UserDAO from '../../../src/dao/user.dao.js'

describe('User Service', () => {
    afterEach(() => {
        sinon.restore()
    })

    it('debería obtener todos los usuarios', async () => {
        const users = [{ id: 'u1' }, { id: 'u2' }]
        sinon.stub(UserDAO, 'getAllUsers').resolves(users)

        const result = await UserService.getAllUsers()
        expect(result).to.deep.equal(users)
    })

    it('debería obtener un usuario por ID', async () => {
        const user = { id: 'u1', name: 'Test User' }
        sinon.stub(UserDAO, 'getUserById').resolves(user)

        const result = await UserService.getUserById('u1')
        expect(result).to.deep.equal(user)
    })

    it('debería eliminar un usuario por ID', async () => {
        sinon.stub(UserDAO, 'deleteUser').resolves(true)

        const result = await UserService.deleteUser('u1')
        expect(result).to.be.true
    })

    it('debería actualizar el rol de un usuario', async () => {
        const updated = { id: 'u1', role: 'admin' }
        sinon.stub(UserDAO, 'updateUserRole').resolves(updated)

        const result = await UserService.updateUserRole('u1', 'admin')
        expect(result).to.deep.equal(updated)
    })
})
