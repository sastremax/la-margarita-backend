import mongoose from 'mongoose'
import UserModel from '../../../src/models/user.model.js'
import authService from '../../../src/services/auth.service.js'

before(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST)
})

after(async () => {
    await mongoose.connection.close()
})

afterEach(async () => {
    await UserModel.deleteMany({ email: { $regex: /^testuser/i } })
})


const testEmail = 'testuser@example.com'
const testPassword = '12345678'

describe('Auth Service', () => {
    it('debería registrar un nuevo usuario correctamente', async () => {
        const user = await authService.registerUser({
            firstName: 'Test',
            lastName: 'User',
            email: testEmail,
            password: testPassword
        })
        console.log('user created:', user)
        expect(user).to.have.property('id')
        expect(user.email).to.equal(testEmail)
    })

    it('debería lanzar error si el email ya está registrado', async () => {
        await authService.registerUser({
            firstName: 'Test',
            lastName: 'User',
            email: testEmail,
            password: testPassword
        })

        await expect(
            authService.registerUser({
                firstName: 'Otro',
                lastName: 'Usuario',
                email: testEmail,
                password: testPassword
            })
        ).to.be.rejectedWith('Email already registered')
    })

    it('debería hacer login correctamente con credenciales válidas', async () => {
        await authService.registerUser({
            firstName: 'Test',
            lastName: 'User',
            email: testEmail,
            password: testPassword
        })

        const result = await authService.loginUser({
            email: testEmail,
            password: testPassword
        })

        expect(result).to.have.property('token')
        expect(result).to.have.property('user')
        expect(result.user.email).to.equal(testEmail)
    })

    it('debería lanzar error si el email es inválido', async () => {
        await expect(
            authService.loginUser({
                email: 'noexiste@example.com',
                password: testPassword
            })
        ).to.be.rejectedWith('Invalid credentials')
    })

    it('debería lanzar error si la contraseña es incorrecta', async () => {
        await authService.registerUser({
            firstName: 'Test',
            lastName: 'User',
            email: testEmail,
            password: testPassword
        })

        await expect(
            authService.loginUser({
                email: testEmail,
                password: 'wrongpassword'
            })
        ).to.be.rejectedWith('Invalid credentials')
    })
})
