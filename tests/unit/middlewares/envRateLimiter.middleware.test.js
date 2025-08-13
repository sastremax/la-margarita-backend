import { beforeEach, describe, expect, it, vi } from 'vitest'

const rateLimitSpy = vi.fn(() => 'rate-mw')

vi.mock('express-rate-limit', () => ({ default: (...args) => rateLimitSpy(...args) }))
vi.mock('../../../src/middlewares/rateLimitHandler.js', () => ({ rateLimitHandler: 'handler' }))

describe('envRateLimiter', () => {
    const OLD_ENV = process.env

    beforeEach(() => {
        vi.clearAllMocks()
        process.env = { ...OLD_ENV }
    })

    it('debería usar defaults cuando env inválido', async () => {
        process.env.RATE_LIMIT_WINDOW_MS = 'x'
        process.env.RATE_LIMIT_MAX = 'y'
        vi.resetModules()
        const mod = await import('../../../src/middlewares/envRateLimiter.js')
        expect(rateLimitSpy).toHaveBeenCalledTimes(1)
        const opts = rateLimitSpy.mock.calls[0][0]
        expect(opts.windowMs).toBe(900000)
        expect(opts.max).toBe(100)
        expect(opts.headers).toBe(true)
        expect(opts.handler).toBe('handler')
        expect(mod.limiter).toBe('rate-mw')
    })

    it('debería usar valores del entorno cuando son números', async () => {
        process.env.RATE_LIMIT_WINDOW_MS = '60000'
        process.env.RATE_LIMIT_MAX = '42'
        vi.resetModules()
        await import('../../../src/middlewares/envRateLimiter.js')
        const opts = rateLimitSpy.mock.calls[0][0]
        expect(opts.windowMs).toBe(60000)
        expect(opts.max).toBe(42)
    })
})
