import { z } from 'zod'
import { passwordSchema } from './common.schema.js'

export const userSchemaRegister = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    password: passwordSchema,
    role: z.enum(['user', 'admin']).optional(),
    age: z.number().int().positive().optional()
})

export const userSchemaGoogle = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    role: z.enum(['user', 'admin']).optional(),
    age: z.number().int().positive().optional()
})