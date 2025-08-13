import { describe, expect, it, vi } from 'vitest'

vi.mock('../../../src/config/logger.js', () => ({ logger: { warn: vi.fn() } }))

import { logger } from '../../../src/config/logger.js'
import { rateLimitHandler } from '../../../src/middlewares/rateLimitHandler.js'

describe('rateLimitHandler', () => {
    it('debería loguear y responder con status del options', () => {
        const req = { ip: '1.1.1.1', originalUrl: '/x', requestId: 'rid-1' }
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn() }
        const options = { statusCode: 429, message: { status: 'error', message: 'Too many' } }
        rateLimitHandler(req, res, null, options)
        expect(logger.warn).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(429)
        expect(res.json).toHaveBeenCalledWith({ status: 'error', message: 'Too many' })
    })
})
