export default function validateDTO(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body)

        if (!result.success) {
            const errors = result.error.errors.map(err => ({
                path: err.path.join('.'),
                message: err.message
            }))

            return res.status(400).json({
                status: 'error',
                errors
            })
        }

        req.body = result.data
        next()
    }
}