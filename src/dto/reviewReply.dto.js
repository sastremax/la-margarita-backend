import z from 'zod'

const reviewReplySchema = z.object({
    message: z.string().min(1)
})

export default reviewReplySchema
