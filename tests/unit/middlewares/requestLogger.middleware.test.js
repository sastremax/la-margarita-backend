import { describe, test, vi, expect, beforeEach } from 'vitest'

let logger
let requestLogger

vi.mock('../../../src/config/logger.js', async () => {
    const mockLogger = {
        info: vi.fn(),
        error: vi.fn()
    }
    return {
        logger: mockLogger
    }
})

beforeEach(async () => {
    vi.clearAllMocks()
    const imported = await import('../../../src/middlewares/requestLogger.middleware.js')
    requestLogger = imported.requestLogger
    const loggerModule = await import('../../../src/config/logger.js')
    logger = loggerModule.logger
})

describe('requestLogger', () => {
    test('should log info for successful requests', () => {
        const req = {
            method: 'GET',
            originalUrl: '/test',
            ip: '123.456.789.000',
            requestId: 'abc123',
            user: { email: 'test@example.com' }
        }

        const res = {
            statusCode: 200,
            on: vi.fn((event, callback) => {
                if (event === 'finish') {
                    callback()
                }
            })
        }

        const next = vi.fn()

        requestLogger(req, res, next)

        expect(next).toHaveBeenCalled()
        expect(logger.info).toHaveBeenCalledWith('REQUEST', expect.objectContaining({
            requestId: 'abc123',
            method: 'GET',
            url: '/test',
            statusCode: 200,
            user: 'test@example.com',
            ip: '123.456.789.000'
        }))
    })

    test('should log error for failed requests', () => {
        const req = {
            method: 'POST',
            originalUrl: '/fail',
            ip: '987.654.321.000',
            requestId: 'def456',
            user: { id: 'user123' }
        }

        const res = {
            statusCode: 500,
            on: vi.fn((event, callback) => {
                if (event === 'finish') {
                    callback()
                }
            })
        }

        const next = vi.fn()

        requestLogger(req, res, next)

        expect(next).toHaveBeenCalled()
        expect(logger.error).toHaveBeenCalledWith('REQUEST', expect.objectContaining({
            requestId: 'def456',
            method: 'POST',
            url: '/fail',
            statusCode: 500,
            user: 'user123',
            ip: '987.654.321.000'
        }))
    })
})
