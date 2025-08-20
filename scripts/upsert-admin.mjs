import dotenv from 'dotenv'
dotenv.config({ path: process.env.DOTENV_CONFIG_PATH })

import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

import UserModel from '../src/models/user.model.js'
import CartModel from '../src/models/cart.model.js'

const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env
if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('Missing env: MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD')
    process.exit(1)
}

const run = async () => {
    await mongoose.connect(MONGODB_URI)

    let user = await UserModel.findOne({ email: ADMIN_EMAIL })
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 10)
    const now = new Date()

    if (!user) {
        user = await UserModel.create({
            firstName: 'Admin',
            lastName: 'User',
            email: ADMIN_EMAIL,
            password: hash,
            role: 'admin',
            emailVerified: true,
            isActive: true,
            createdAt: now,
            updatedAt: now
        })

        const cart = await CartModel.create({ user: user._id, products: [] })
        user.cart = cart._id
        await user.save()

        console.log({ action: 'created', id: user._id.toString(), email: user.email, cart: cart._id.toString() })
    } else {
        const update = {
            password: hash,
            role: 'admin',
            emailVerified: true,
            isActive: true,
            updatedAt: now
        }
        if (!user.firstName) update.firstName = 'Admin'
        if (!user.lastName) update.lastName = 'User'
        await UserModel.updateOne({ _id: user._id }, { $set: update })

        if (!user.cart) {
            const cart = await CartModel.create({ user: user._id, products: [] })
            await UserModel.updateOne({ _id: user._id }, { $set: { cart: cart._id } })
        }

        const refreshed = await UserModel.findById(user._id).lean()
        console.log({ action: 'updated', id: refreshed._id.toString(), email: refreshed.email, cart: refreshed.cart?.toString() })
    }

    await mongoose.disconnect()
    process.exit(0)
}

run().catch(async e => {
    console.error(e)
    await mongoose.disconnect()
    process.exit(1)
})
