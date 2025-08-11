import { beforeEach, describe, expect, test, vi } from 'vitest'

const infoMock = vi.fn()

vi.mock('../../../src/config/logger.js', () => ({
    logger: { info: infoMock, level: 'info' }
}))

describe('auditLogger middleware', () => {
    let auditLogger
    const next = vi.fn()
    const res = {}

    beforeEach(async () => {
        vi.clearAllMocks()
        const module = await import('../../../src/middlewares/auditLogger.js')
        auditLogger = module.auditLogger
    })

    test('should log audit info with authenticated user', () => {
        const req = {
            user: { id: 'user123' },
            ip: '192.168.1.1',
            method: 'GET',
            originalUrl: '/api/data'
        }

        auditLogger(req, res, next)

        expect(infoMock).toHaveBeenCalledTimes(1)
        const log = infoMock.mock.calls[0][0]

        expect(log).toContain('GET')
        expect(log).toContain('/api/data')
        expect(log).toContain('user123')
        expect(log).toContain('192.168.1.1')
        expect(log).toContain('[AUDIT]')
        expect(next).toHaveBeenCalled()
    })

    test('should log audit info with anonymous user if user is missing', () => {
        const req = {
            ip: '127.0.0.1',
            method: 'POST',
            originalUrl: '/api/test'
        }

        auditLogger(req, res, next)

        expect(infoMock).toHaveBeenCalledTimes(1)
        const log = infoMock.mock.calls[0][0]

        expect(log).toContain('POST')
        expect(log).toContain('/api/test')
        expect(log).toContain('anonymous')
        expect(log).toContain('127.0.0.1')
        expect(log).toContain('[AUDIT]')
        expect(next).toHaveBeenCalled()
    })
})
