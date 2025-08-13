import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../../src/config/logger.js', () => ({
    logger: { info: vi.fn(), error: vi.fn() }
}))

import { logger } from '../../../src/config/logger.js'
import { auditLogger } from '../../../src/middlewares/auditLogger.js'

describe('auditLogger', () => {
    let req, res, next

    beforeEach(() => {
        vi.clearAllMocks()
        req = { method: 'GET', originalUrl: '/x', ip: '127.0.0.1', user: { id: 'u1' } }
        res = {}
        next = vi.fn()
    })

    it('debería loguear con userId', () => {
        auditLogger(req, res, next)
        expect(logger.info).toHaveBeenCalledTimes(1)
        const msg = logger.info.mock.calls[0][0]
        expect(msg).toContain('[AUDIT]')
        expect(msg).toContain('GET')
        expect(msg).toContain('/x')
        expect(msg).toContain('User: u1')
        expect(next).toHaveBeenCalled()
    })

    it('debería loguear como anonymous si no hay user', () => {
        req.user = undefined
        auditLogger(req, res, next)
        const msg = logger.info.mock.calls[0][0]
        expect(msg).toContain('User: anonymous')
    })
})
