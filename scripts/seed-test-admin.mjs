import 'dotenv-flow/config'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { config as appConfig } from '../src/config/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const load = async (rel, named) => {
    const full = path.resolve(__dirname, rel)
    const url = pathToFileURL(full).href
    const m = await import(url)
    return m[named] || m.default
}

async function run() {
    const env = (process.env.NODE_ENV || '').toLowerCase()
    if (env !== 'test') throw new Error(`Refusing to seed outside test. NODE_ENV=${env}`)
    if (!appConfig.mongoUri) throw new Error('mongoUri is empty')

    console.log(JSON.stringify({ step: 'connect', mongoUri: appConfig.mongoUri, NODE_ENV: env }, null, 2))
    await mongoose.connect(appConfig.mongoUri)
    console.log(JSON.stringify({ step: 'connected' }, null, 2))

    const UserModel = await load('../src/models/user.model.js', 'UserModel')
    const CartModel = await load('../src/models/cart.model.js', 'CartModel')

    const email = 'maxi@example.com'
    const plain = '12345678'

    const hasPassword = Boolean(UserModel.schema.path('password'))
    if (!hasPassword) throw new Error('UserModel requires password field')

    let user = await UserModel.findOne({ email: email.toLowerCase() })

    if (!user) {
        const base = {
            firstName: 'Maxi',
            lastName: 'Admin',
            email: email.toLowerCase(),
            password: plain,
            role: 'admin',
            isVerified: true,
            isActive: true,
            failedLoginAttempts: 0,
            lockUntil: null,
            age: 24
        }
        user = await UserModel.create(base)
        console.log(JSON.stringify({ step: 'user_created', userId: String(user._id) }, null, 2))
    } else {
        let changed = false
        const ok = await bcrypt.compare(plain, user.password || '')
        if (!ok) { user.password = plain; changed = true }
        if (user.role !== 'admin') { user.role = 'admin'; changed = true }
        if (user.isVerified !== true) { user.isVerified = true; changed = true }
        if (user.isActive !== true) { user.isActive = true; changed = true }
        if (user.failedLoginAttempts !== 0) { user.failedLoginAttempts = 0; changed = true }
        if (user.lockUntil) { user.lockUntil = null; changed = true }
        if (changed) {
            await user.save()
            console.log(JSON.stringify({ step: 'user_updated', userId: String(user._id) }, null, 2))
        } else {
            console.log(JSON.stringify({ step: 'user_noop', userId: String(user._id) }, null, 2))
        }
    }

    if (!user.cart) {
        const cart = await CartModel.create({ user: user._id, products: [] })
        user.cart = cart._id
        await user.save()
        console.log(JSON.stringify({ step: 'cart_created', cartId: String(cart._id) }, null, 2))
    } else {
        console.log(JSON.stringify({ step: 'cart_exists', cartId: String(user.cart) }, null, 2))
    }

    await mongoose.connection.close()
    console.log(JSON.stringify({ step: 'done' }, null, 2))
}

run().catch(async (e) => {
    try { await mongoose.connection.close() } catch { }
    console.error(e?.stack || String(e))
    process.exit(1)
})
