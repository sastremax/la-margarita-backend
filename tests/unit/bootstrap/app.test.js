import { beforeEach, describe, expect, it, vi } from 'vitest'

const fork = vi.fn(() => ({ process: { pid: Math.floor(Math.random() * 10000) } }))
const on = vi.fn()
let clusterMock = { isPrimary: true, fork, on }

vi.mock('node:cluster', () => ({ default: clusterMock }))
vi.mock('cluster', () => ({ default: clusterMock }))

const cpus = vi.fn(() => [1, 2, 3])
vi.mock('node:os', () => ({ default: { cpus }, cpus }))
vi.mock('os', () => ({ default: { cpus }, cpus }))

const info = vi.fn()
const warn = vi.fn()
const fatal = vi.fn()
vi.mock('../../../src/config/logger.js', () => ({ logger: { info, warn, fatal } }))

const startServer = vi.fn()
vi.mock('../../../src/appServer.js', () => ({ startServer }))

vi.mock('../../../src/config/index.js', () => ({ config: { nodeEnv: 'development', mongoUri: 'mongodb://host/dbName' } }))

describe('app.js', () => {
    const OLD_ENV = process.env
    const exit = process.exit

    beforeEach(() => {
        vi.resetModules()
        process.env = { ...OLD_ENV }
        process.exit = vi.fn()
        fork.mockClear()
        on.mockClear()
        info.mockClear()
        warn.mockClear()
        fatal.mockClear()
        startServer.mockReset()
        clusterMock = { isPrimary: true, fork, on }
        vi.doMock('node:cluster', () => ({ default: clusterMock }))
        vi.doMock('cluster', () => ({ default: clusterMock }))
    })

    it('debería forkar N workers en primary y re-forkear en exit', async () => {
        clusterMock.isPrimary = true
        await import('../../../src/app.js')
        expect(fork).toHaveBeenCalledTimes(3)
        expect(on).toHaveBeenCalledWith('exit', expect.any(Function))
    })

    it('debería iniciar servidor en worker y loguear', async () => {
        clusterMock.isPrimary = false
        startServer.mockResolvedValue()
        await import('../../../src/app.js')
        expect(startServer).toHaveBeenCalled()
    })

    it('debería salir con código 1 si startServer falla', async () => {
        clusterMock.isPrimary = false
        startServer.mockRejectedValue(new Error('boom'))
        await import('../../../src/app.js')
        expect(fatal).toHaveBeenCalled()
        expect(process.exit).toHaveBeenCalledWith(1)
        process.exit = exit
    })
})
