import mongoose from 'mongoose'
import { beforeEach, describe, expect, test, vi, } from 'vitest'
import AuditLog from '../../../src/models/auditLog.model.js'
import { AuditService } from '../../../src/services/audit.service.js'

vi.mock('../../../src/models/auditLog.model.js', () => ({
    __esModule: true,
    default: {
        create: vi.fn()
    }
}))

describe('AuditService', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    test('logEvent - should call AuditLog.create with correct data', async () => {
        const userId = new mongoose.Types.ObjectId()
        const event = 'USER_LOGIN'
        const success = true
        const ip = '127.0.0.1'
        const userAgent = 'Vitest'

        await AuditService.logEvent({ userId, event, success, ip, userAgent })

        expect(AuditLog.create).toHaveBeenCalledWith({
            user: userId,
            event,
            success,
            ip,
            userAgent
        })
    })

    test('logEvent - should omit user if userId is null', async () => {
        const event = 'USER_LOGIN'
        const success = false
        const ip = '192.168.0.1'
        const userAgent = 'MockAgent'

        await AuditService.logEvent({ userId: null, event, success, ip, userAgent })

        expect(AuditLog.create).toHaveBeenCalledWith({
            user: undefined,
            event,
            success,
            ip,
            userAgent
        })
    })
})
