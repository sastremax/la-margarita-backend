import { expect } from 'chai'
import sinon from 'sinon'
import AuditService from '../../../src/services/audit.service.js'
import AuditLog from '../../../src/models/auditLog.model.js'

describe('Audit Service', () => {
    const fakeEvent = {
        userId: 'user123',
        event: 'test_event',
        success: true,
        ip: '127.0.0.1',
        userAgent: 'PostmanRuntime/7.31.3'
    }

    beforeEach(() => {
        sinon.restore()
    })

    describe('logEvent', () => {
        it('debería registrar un evento de auditoría exitosamente', async () => {
            const stub = sinon.stub(AuditLog, 'create').resolves()

            await AuditService.logEvent(fakeEvent)

            expect(stub.calledOnceWith({
                user: fakeEvent.userId,
                event: fakeEvent.event,
                success: true,
                ip: fakeEvent.ip,
                userAgent: fakeEvent.userAgent
            })).to.be.true
        })

        it('debería lanzar un error si AuditLog.create falla', async () => {
            sinon.stub(AuditLog, 'create').throws(new Error('DB error'))

            try {
                await AuditService.logEvent(fakeEvent)
                throw new Error('No se lanzó el error esperado')
            } catch (error) {
                expect(error.message).to.equal('DB error')
            }
        })
    })
})
