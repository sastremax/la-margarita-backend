export default function validateDTO(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body)

        if (!result.success) {
            return res.status(400).json({
                status: 'error',
                errors: result.error.errors.map(e => ({
                    path: e.path.join('.'),
                    message: e.message
                }))
            })
        }

        req.body = result.data
        next()
    }
}