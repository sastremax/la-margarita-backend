import { beforeEach, describe, expect, it, vi } from 'vitest'

const use = vi.fn()
const listen = vi.fn((_, cb) => cb && cb())
vi.mock('../../../src/appExpress.js', () => ({ app: { use, listen } }))

const connectToDB = vi.fn()
vi.mock('../../../src/config/db.js', () => ({ connectToDB }))

const initialize = vi.fn(() => 'passport-init-mw')
vi.mock('passport', () => ({ default: { initialize } }))

const info = vi.fn()
const fatal = vi.fn()
vi.mock('../../../src/config/logger.js', () => ({ logger: { info, fatal } }))

vi.mock('../../../src/config/passport.config.js', () => ({}))

describe('appServer.startServer', () => {
    const OLD_ENV = process.env
    const exit = process.exit

    beforeEach(() => {
        vi.resetModules()
        process.env = { ...OLD_ENV }
        process.exit = vi.fn()
        use.mockClear()
        listen.mockClear()
        connectToDB.mockReset()
        info.mockClear()
        fatal.mockClear()
    })

    it('debería hacer early-return en test', async () => {
        process.env.NODE_ENV = 'test'
        vi.mock('../../../src/config/index.js', () => ({ config: { port: 4000 } }), { overwrite: true })
        const { startServer } = await import('../../../src/appServer.js')
        await startServer()
        expect(connectToDB).not.toHaveBeenCalled()
        expect(listen).not.toHaveBeenCalled()
    })

    it('debería conectar DB, inicializar passport y escuchar puerto', async () => {
        process.env.NODE_ENV = 'development'
        vi.mock('../../../src/config/index.js', () => ({ config: { port: 4000 } }), { overwrite: true })
        connectToDB.mockResolvedValue({})
        const { startServer } = await import('../../../src/appServer.js')
        await startServer()
        expect(connectToDB).toHaveBeenCalled()
        expect(use).toHaveBeenCalledWith('passport-init-mw')
        expect(listen).toHaveBeenCalledWith(4000, expect.any(Function))
    })

    it('debería loguear fatal y salir en error', async () => {
        process.env.NODE_ENV = 'development'
        vi.mock('../../../src/config/index.js', () => ({ config: { port: 4000 } }), { overwrite: true })
        connectToDB.mockRejectedValue(new Error('fail'))
        const { startServer } = await import('../../../src/appServer.js')
        await startServer()
        expect(fatal).toHaveBeenCalled()
        expect(process.exit).toHaveBeenCalledWith(1)
        process.exit = exit
    })
})
