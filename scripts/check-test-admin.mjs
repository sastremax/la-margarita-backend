import 'dotenv-flow/config'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { config as appConfig } from '../src/config/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const loadModel = async (relPath, named) => {
    const full = path.resolve(__dirname, relPath)
    const url = pathToFileURL(full).href
    const m = await import(url)
    return m[named] || m.default
}

async function run() {
    process.env.NODE_ENV = 'test'
    await mongoose.connect(appConfig.mongoUri)

    const UserModel = await loadModel('../src/models/user.model.js', 'UserModel')

    const email = 'maxi@example.com'
    const user = await UserModel.findOne({ email: email.toLowerCase() }).select('+password +passwordHash').lean()

    const bcryptOk = user ? await bcrypt.compare('Admin$12345', user.password || user.passwordHash || '') : false

    const result = {
        exists: !!user,
        email: user?.email || null,
        role: user?.role || null,
        hasCart: Boolean(user?.cart),
        keys: user ? Object.keys(user).slice(0, 40) : [],
        hasPasswordField: Object.prototype.hasOwnProperty.call(user || {}, 'password'),
        hasPasswordHashField: Object.prototype.hasOwnProperty.call(user || {}, 'passwordHash'),
        emailVerified: user?.emailVerified ?? null,
        isVerified: user?.isVerified ?? null,
        isActive: user?.isActive ?? null,
        bcryptOk
    }

    console.log(JSON.stringify(result, null, 2))
    await mongoose.connection.close()
}

run().catch(async (e) => {
    try { await mongoose.connection.close() } catch { }
    console.error(e?.stack || String(e))
    process.exit(1)
})
