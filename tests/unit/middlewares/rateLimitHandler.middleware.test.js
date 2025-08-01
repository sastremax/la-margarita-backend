import { describe, test, expect, vi, beforeEach } from 'vitest'

vi.mock('../../../src/config/logger.js', () => ({
    logger: {
        warn: vi.fn()
    }
}))

import { logger } from '../../../src/config/logger.js'
import { rateLimitHandler } from '../../../src/middlewares/rateLimitHandler.js'

describe('rateLimitHandler middleware', () => {
    const req = {
        ip: '192.168.1.1',
        originalUrl: '/api/test',
        requestId: 'req-1234'
    }

    const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
    }

    const options = {
        statusCode: 429,
        message: { status: 'error', message: 'Rate limit exceeded' }
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    test('should log warning and return rate limit response', () => {
        rateLimitHandler(req, res, null, options)

        expect(logger.warn).toHaveBeenCalled()
        const logMessage = logger.warn.mock.calls[0][0]
        expect(logMessage).toMatch(/req-1234 - Rate limit exceeded/)
        expect(logMessage).toMatch(/192\.168\.1\.1/)
        expect(logMessage).toMatch(/\/api\/test/)

        expect(res.status).toHaveBeenCalledWith(429)
        expect(res.json).toHaveBeenCalledWith(options.message)
    })

    test('should fallback to default requestId if missing', () => {
        const reqWithoutId = {
            ip: '127.0.0.1',
            originalUrl: '/api/other'
        }

        rateLimitHandler(reqWithoutId, res, null, options)

        expect(logger.warn).toHaveBeenCalled()
        const logMessage = logger.warn.mock.calls[0][0]
        expect(logMessage).toContain('no-request-id')
        expect(logMessage).toMatch(/127\.0\.0\.1/)
        expect(logMessage).toMatch(/\/api\/other/)
    })
})
