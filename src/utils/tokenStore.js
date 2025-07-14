const validRefreshTokens = new Set()

const saveRefreshToken = (token) => {
    validRefreshTokens.add(token)
}

const isRefreshTokenValid = (token) => {
    return validRefreshTokens.has(token)
}

const removeRefreshToken = (token) => {
    validRefreshTokens.delete(token)
}

export default {
    saveRefreshToken,
    isRefreshTokenValid,
    removeRefreshToken
}