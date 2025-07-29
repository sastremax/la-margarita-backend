import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { config } from './src/config/index.js'
import UserModel from './src/models/user.model.js'
import CartModel from './src/models/cart.model.js'

dotenv.config({
    path: config.mode === 'test' ? './.env.test' : './.env'
})

const run = async () => {
    try {
        console.log('[Script] Connecting to database...')
        await mongoose.connect(config.mongoUri)

        const existing = await UserModel.findOne({ email: 'maxi@example.com' })
        if (existing) {
            console.log('Admin user already exists:', existing._id.toString())
            process.exit(0)
        }

        const cart = await CartModel.create({ products: [] })

        const newUser = await UserModel.create({
            firstName: 'Maxi',
            lastName: 'Sastre',
            email: 'maxi@example.com',
            password: '12345678',
            role: 'admin',
            cart: cart._id,
            age: 24
        })

        console.log('Admin user created with ID:', newUser._id.toString())
        process.exit(0)
    } catch (error) {
        console.error('Error creating admin user:', error.message)
        process.exit(1)
    }
}

run()
