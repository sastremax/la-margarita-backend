import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../../src/config/logger.js', () => ({
    logger: { info: vi.fn(), error: vi.fn() }
}))

import { logger } from '../../../src/config/logger.js'
import { requestLogger } from '../../../src/middlewares/requestLogger.middleware.js'

const makeRes = () => {
    const res = { statusCode: 200 }
    const handlers = {}
    res.on = (ev, cb) => { handlers[ev] = cb }
    res._emit = (ev) => handlers[ev] && handlers[ev]()
    return res
}

describe('requestLogger.middleware', () => {
    let req, res, next

    beforeEach(() => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date('2025-01-01T00:00:00Z'))
        vi.clearAllMocks()
        req = { method: 'GET', originalUrl: '/x', ip: '1.1.1.1', headers: { 'user-agent': 'ua' }, user: { id: 'u1', email: 'a@b.com' }, requestId: 'rid-1' }
        res = makeRes()
        next = vi.fn()
    })

    it('debería loguear info con 2xx/3xx', () => {
        requestLogger(req, res, next)
        res.statusCode = 200
        res._emit('finish')
        expect(next).toHaveBeenCalled()
        expect(logger.info).toHaveBeenCalled()
    })

    it('debería loguear error con 4xx/5xx', () => {
        requestLogger(req, res, next)
        res.statusCode = 404
        res._emit('finish')
        expect(logger.error).toHaveBeenCalled()
    })
})
