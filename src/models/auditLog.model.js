import mongoose from 'mongoose'

const auditLogSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    event: { type: String, enum: ['login', 'logout'], required: true },
    success: { type: Boolean, required: true },
    ip: { type: String },
    userAgent: { type: String },
    createdAt: { type: Date, default: Date.now }
})

const AuditLog = mongoose.model('AuditLog', auditLogSchema)

export default AuditLog
