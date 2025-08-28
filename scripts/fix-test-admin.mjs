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

const requireStrongPassword = (pwd) => {
    const re = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{10,}$/
    return re.test(String(pwd || ''))
}

async function run() {
    if ((process.env.NODE_ENV || '').toLowerCase() !== 'test') throw new Error('Refusing to run outside test')
    await mongoose.connect(appConfig.mongoUri)

    const UserModel = await load('../src/models/user.model.js', 'UserModel')

    const email = (process.env.ADMIN_EMAIL || 'maxi@example.com')
    const plain = (process.env.ADMIN_PASSWORD || 'Adm1n!2345')

    if (!requireStrongPassword(plain)) throw new Error('Weak ADMIN_PASSWORD')

    const user = await UserModel.findOne({ email: email.toLowerCase() }).select('+password +passwordHash')
    if (!user) throw new Error('Admin not found')

    const has = (p) => Boolean(UserModel.schema.path(p))
    let changed = false

    if (has('role') && user.role !== 'admin') { user.role = 'admin'; changed = true }
    if (has('isActive') && user.isActive !== true) { user.isActive = true; changed = true }
    if (has('isVerified') && user.isVerified !== true) { user.isVerified = true; changed = true }
    if (has('emailVerified') && user.emailVerified !== true) { user.emailVerified = true; changed = true }
    if (has('failedLoginAttempts') && user.failedLoginAttempts !== 0) { user.failedLoginAttempts = 0; changed = true }
    if (has('lockUntil') && user.lockUntil) { user.lockUntil = null; changed = true }

    if (has('password')) { user.password = plain; changed = true }
    else if (has('passwordHash')) { user.passwordHash = await bcrypt.hash(plain, 10); changed = true }

    if (changed) await user.save()

    const out = {
        id: String(user._id),
        role: has('role') ? user.role : null,
        emailVerified: has('emailVerified') ? user.emailVerified === true : null,
        isVerified: has('isVerified') ? user.isVerified === true : null,
        isActive: has('isActive') ? user.isActive === true : null
    }
    console.log(JSON.stringify(out, null, 2))

    await mongoose.connection.close()
}

run().catch(async (e) => {
    try { await mongoose.connection.close() } catch { }
    console.error(e?.stack || String(e))
    process.exit(1)
})
