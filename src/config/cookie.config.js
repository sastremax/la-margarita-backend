const accessTokenCookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000
}

const refreshTokenCookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
}

export default {
    accessTokenCookieOptions,
    refreshTokenCookieOptions
}
