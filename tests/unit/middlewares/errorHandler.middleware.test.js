import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../../src/config/logger.js', () => ({
    logger: { error: vi.fn() }
}))

import { logger } from '../../../src/config/logger.js'
import { errorHandler } from '../../../src/middlewares/errorHandler.middleware.js'

describe('errorHandler.middleware', () => {
    let req, res
    const OLD_ENV = process.env.NODE_ENV

    beforeEach(() => {
        vi.clearAllMocks()
        req = { originalUrl: '/x', method: 'GET', ip: '127.0.0.1', requestId: 'rid-1' }
        res = { status: vi.fn().mockReturnThis(), json: vi.fn() }
    })

    it('debería responder con status y message provistos', () => {
        const err = { statusCode: 400, message: 'Bad' }
        errorHandler(err, req, res)
        expect(logger.error).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ status: 'error', message: 'Bad' })
    })

    it('debería usar defaults cuando faltan statusCode/message', () => {
        const err = {}
        errorHandler(err, req, res)
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ status: 'error', message: 'Internal server error' })
    })

    it('debería incluir stack en development', () => {
        process.env.NODE_ENV = 'development'
        const err = new Error('Boom')
        errorHandler(err, req, res)
        const body = res.json.mock.calls[0][0]
        expect(body.stack).toBeDefined()
        process.env.NODE_ENV = OLD_ENV
    })
})
