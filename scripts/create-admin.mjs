import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config({ path: process.env.DOTENV_CONFIG_PATH })

const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env

if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('Missing env vars: MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD')
    process.exit(1)
}

const run = async () => {
    try {
        await mongoose.connect(MONGODB_URI)

        const hash = await bcrypt.hash(ADMIN_PASSWORD, 10)

        const r = await mongoose.connection.db.collection('users').updateOne(
            { email: ADMIN_EMAIL },
            {
                $set: {
                    email: ADMIN_EMAIL,
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
