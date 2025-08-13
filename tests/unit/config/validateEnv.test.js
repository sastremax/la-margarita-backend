import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('config/validateEnv', () => {
    const OLD_ENV = process.env
    const exit = process.exit
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

    beforeEach(() => {
        vi.resetModules()
        process.env = { ...OLD_ENV }
        process.exit = vi.fn()
        errorSpy.mockClear()
    })

    it('debería salir si faltan variables base', async () => {
        process.env.NODE_ENV = 'production'
        await import('../../../src/config/validateEnv.js')
        expect(process.exit).toHaveBeenCalledWith(1)
        expect(errorSpy).toHaveBeenCalled()
        process.exit = exit
    })

    it('debería permitir test con MONGO_URI_TEST presente', async () => {
        process.env.NODE_ENV = 'test'
        process.env.JWT_SECRET = 's'
        process.env.JWT_REFRESH_SECRET = 'rs'
        process.env.JWT_EXPIRES = '15m'
        process.env.MONGO_URI_TEST = 'mongodb://test'
        await import('../../../src/config/validateEnv.js')
        expect(process.exit).not.toHaveBeenCalled()
        process.exit = exit
    })
})
