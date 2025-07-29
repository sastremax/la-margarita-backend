import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

const encryptPassword = async (plainPassword) => {
    return await bcrypt.hash(plainPassword, SALT_ROUNDS)
}

const comparePassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword)
}

export const passwordUtil = {
    encryptPassword,
    comparePassword
}
