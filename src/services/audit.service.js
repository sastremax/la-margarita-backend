import AuditLog from '../models/auditLog.model.js'

const logEvent = async ({ userId, event, success, ip, userAgent }) => {
    await AuditLog.create({
        user: userId || undefined,
        event,
        success,
        ip,
        userAgent
    })
}

export default {
    logEvent
}
