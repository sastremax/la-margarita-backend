import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('config/index', () => {
    const OLD_ENV = process.env

    beforeEach(() => {
        vi.resetModules()
        process.env = { ...OLD_ENV }
    })

    it('debería mapear MONGO_URI_TEST cuando NODE_ENV=test', async () => {
        process.env.NODE_ENV = 'test'
        process.env.MONGO_URI_TEST = 'mongodb://test'
        const { config } = await import('../../../src/config/index.js')
        expect(config.mongoUri).toBe('mongodb://test')
    })

    it('debería mapear MONGO_URI cuando no es test', async () => {
        process.env.NODE_ENV = 'development'
        process.env.MONGO_URI = 'mongodb://dev'
        const { config } = await import('../../../src/config/index.js')
        expect(config.mongoUri).toBe('mongodb://dev')
    })

    it('debería exponer jwt config', async () => {
        process.env.JWT_SECRET = 's'
        process.env.JWT_REFRESH_SECRET = 'rs'
        process.env.JWT_EXPIRES = '15m'
        const { config } = await import('../../../src/config/index.js')
        expect(config.jwt).toEqual({ secret: 's', refreshSecret: 'rs', expires: '15m' })
    })
})
