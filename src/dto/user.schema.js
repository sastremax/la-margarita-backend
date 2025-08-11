import { z } from 'zod'
import { passwordSchema } from './common.schema.js'

export const userSchemaRegister = z.object({
    firstName: z.string().trim().min(1),
    lastName: z.string().trim().min(1),
    email: z.string().email(),
    password: passwordSchema,
    role: z.enum(['admin', 'user']).optional(),
    age: z.coerce.number().int().positive().optional()
})

export const userSchemaGoogle = z.object({
    firstName: z.string().trim().min(1),
    lastName: z.string().trim().min(1),
    email: z.string().email(),
    role: z.enum(['admin', 'user']).optional(),
    age: z.coerce.number().int().positive().optional()
})
