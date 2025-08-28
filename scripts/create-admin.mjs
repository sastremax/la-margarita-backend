import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config({ path: process.env.DOTENV_CONFIG_PATH })

const env = (process.env.NODE_ENV || '').toLowerCase()
const uri = env === 'test'
    ? (process.env.MONGO_URI_TEST || process.env.MONGODB_URI || process.env.MONGO_URI)
    : (process.env.MONGO_URI || process.env.MONGODB_URI)

const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env

if (!uri || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('Missing env vars: MONGO_URI or MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD')
    process.exit(1)
}

const run = async () => {
    try {
        await mongoose.connect(uri)
        const hash = await bcrypt.hash(ADMIN_PASSWORD, 10)
        const r = await mongoose.connection.db.collection('users').updateOne(
            { email: ADMIN_EMAIL.toLowerCase() },
            {
                $set: {
                    email: ADMIN_EMAIL.toLowerCase(),
                    password: hash,
                    role: 'admin',
                    isActive: true,
                    emailVerified: true
                }
            },
            { upsert: true }
        )
        console.log({ matched: r.matchedCount, modified: r.modifiedCount, upsertedId: r.upsertedId })
        await mongoose.disconnect()
        process.exit(0)
    } catch (e) {
        console.error(e)
        process.exit(1)
    }
}

run()
