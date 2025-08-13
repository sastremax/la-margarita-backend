import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../../src/config/logger.js', () => ({
    logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() }
}))

import { logger } from '../../../src/config/logger.js'
import { loggerMiddleware } from '../../../src/middlewares/logger.middleware.js'

const makeRes = () => {
    const res = { statusCode: 200 }
    const handlers = {}
    res.on = (ev, cb) => { handlers[ev] = cb }
    res._emit = (ev) => handlers[ev] && handlers[ev]()
    return res
}

describe('logger.middleware', () => {
    let req, res, next

    beforeEach(() => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date('2025-01-01T00:00:00Z'))
        vi.clearAllMocks()
        req = { method: 'GET', originalUrl: '/x', ip: '1.1.1.1', headers: { 'user-agent': 'ua' }, user: { id: 'u1', email: 'a@b.com' } }
        res = makeRes()
        next = vi.fn()
    })

    it('debería loguear a info con status 2xx/3xx', () => {
        loggerMiddleware(req, res, next)
        res.statusCode = 200
        vi.setSystemTime(new Date('2025-01-01T00:00:01Z'))
        res._emit('finish')
        expect(next).toHaveBeenCalled()
        expect(logger.info).toHaveBeenCalled()
        const args = logger.info.mock.calls[0]
        expect(args[0]).toBe('AUDIT')
        expect(args[1]).toMatchObject({ method: 'GET', url: '/x', statusCode: 200, user: 'a@b.com' })
        expect(req.requestId).toBeDefined()
    })

    it('debería loguear a warn con status 4xx', () => {
        loggerMiddleware(req, res, next)
        res.statusCode = 404
        res._emit('finish')
        expect(logger.warn).toHaveBeenCalled()
    })

    it('debería loguear a error con status 5xx', () => {
        loggerMiddleware(req, res, next)
        res.statusCode = 500
        res._emit('finish')
        expect(logger.error).toHaveBeenCalled()
    })
})
