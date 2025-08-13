import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../../src/config/devLogger.js', () => ({ devLogger: { name: 'dev' } }))
vi.mock('../../../src/config/prodLogger.js', () => ({ prodLogger: { name: 'prod' } }))
vi.mock('../../../src/config/testLogger.js', () => ({ testLogger: { name: 'test' } }))

describe('config/logger', () => {
    const OLD_ENV = process.env

    beforeEach(() => {
        vi.resetModules()
        process.env = { ...OLD_ENV }
    })

    it('debería usar testLogger en NODE_ENV=test', async () => {
        process.env.NODE_ENV = 'test'
        const { logger } = await import('../../../src/config/logger.js')
        expect(logger).toEqual({ name: 'test', level: logger.level })
    })

    it('debería usar prodLogger en production', async () => {
        process.env.NODE_ENV = 'production'
        const { logger } = await import('../../../src/config/logger.js')
        expect(logger).toEqual({ name: 'prod', level: logger.level })
    })

    it('debería usar devLogger por defecto y aplicar logLevel', async () => {
        process.env.NODE_ENV = 'development'
        process.env.LOG_LEVEL = 'debug'
        const { logger } = await import('../../../src/config/logger.js')
        expect(logger).toEqual({ name: 'dev', level: 'debug' })
    })
})
