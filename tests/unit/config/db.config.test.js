import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('mongoose', () => ({ default: { connect: vi.fn() } }))
vi.mock('../../../src/config/logger.js', () => ({ logger: { info: vi.fn(), fatal: vi.fn() } }))

import mongoose from 'mongoose'
import { logger } from '../../../src/config/logger.js'

describe('config/db connectToDB', () => {
    const OLD_ENV = process.env
    const exit = process.exit

    beforeEach(() => {
        vi.resetModules()
        process.env = { ...OLD_ENV, NODE_ENV: 'test', MONGO_URI_TEST: 'mongodb://test' }
        process.exit = vi.fn()
        vi.clearAllMocks()
    })

    it('debería conectar y loguear info', async () => {
        mongoose.connect.mockResolvedValue({})
        const { connectToDB } = await import('../../../src/config/db.js')
        await connectToDB()
        expect(mongoose.connect).toHaveBeenCalledWith('mongodb://test')
        expect(logger.info).toHaveBeenCalled()
    })

    it('debería loguear fatal y salir en error', async () => {
        process.env.NODE_ENV = 'production'
        mongoose.connect.mockRejectedValue(new Error('fail'))
        const { connectToDB } = await import('../../../src/config/db.js')
        await connectToDB()
        expect(logger.fatal).toHaveBeenCalled()
        expect(process.exit).toHaveBeenCalledWith(1)
        process.env.NODE_ENV = 'test'
    })
})
