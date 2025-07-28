import z from 'zod'

export const reviewReplySchema = z.object({
    message: z.string().min(1)
})

