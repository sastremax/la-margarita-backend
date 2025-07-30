import { z } from 'zod'

export const passwordSchema = z.string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).+$/, {
        message: 'Password must contain at least one letter, one number, and one special character'
    })
