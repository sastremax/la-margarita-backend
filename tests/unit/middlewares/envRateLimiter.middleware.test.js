import { beforeEach, describe, expect, test, vi } from 'vitest'

const rateLimitMock = vi.fn()
vi.mock('express-rate-limit', () => {
    return {
        default: rateLimitMock
    }
})

vi.mock('../../../src/middlewares/rateLimitHandler.js', () => {
    return {
        rateLimitHandler: vi.fn()
    }
})

beforeEach(() => {
    vi.clearAllMocks()
    process.env.RATE_LIMIT_WINDOW_MS = '60000'
    process.env.RATE_LIMIT_MAX = '20'
})

describe('limiter middleware', () => {
    test('should call express-rate-limit with correct options', async () => {
        const { rateLimitHandler } = await import('../../../src/middlewares/rateLimitHandler.js')
        await import('../../../src/middlewares/envRateLimiter.js')

        expect(rateLimitMock).toHaveBeenCalledWith({
            windowMs: 60000,
            max: 20,
            message: {
                status: 'error',
                message: 'Too many requests, please try again later.'
            },
            headers: true,
            handler: rateLimitHandler
        })
    })

    test('should use default values if env vars are not valid', async () => {
        process.env.RATE_LIMIT_WINDOW_MS = 'invalid'
        process.env.RATE_LIMIT_MAX = 'invalid'

        vi.resetModules()
        const { rateLimitHandler } = await import('../../../src/middlewares/rateLimitHandler.js')
        await import('../../../src/middlewares/envRateLimiter.js')

        expect(rateLimitMock).toHaveBeenCalledWith({
            windowMs: 900000,
            max: 100,
            message: {
                status: 'error',
                message: 'Too many requests, please try again later.'
            },
            headers: true,
            handler: rateLimitHandler
        })
    })
})
