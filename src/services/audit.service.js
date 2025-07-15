import AuditLog from '../models/auditLog.model.js'

class AuditService {
    static async logEvent({ userId, event, success, ip, userAgent }) {
        await AuditLog.create({
            user: userId || undefined,
            event,
            success,
            ip,
            userAgent
        })
    }
}

export default AuditService
