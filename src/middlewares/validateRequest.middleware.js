import { validationResult } from 'express-validator'

export default function validateRequest(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 'error', errors: errors.array() })
    }
    next()
}
