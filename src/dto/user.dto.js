import { z } from 'zod'

export const userSchemaRegister = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    password: z.string()
        .min(8)
        .regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).+$/, {
            message: 'Password must contain at least one letter, one number, and one special character'
        }),
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

export function asPublicUser(user) {
    return {
        id: user._id,
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        cartId: user.cart?._id || null
    }
}

