export const validateDTO = (schema) => {
    if (!schema || typeof schema.safeParse !== 'function') {
        throw new Error('Invalid schema provided to validateDTO middleware')
    }

    return (req, res, next) => {
        const result = schema.safeParse(req.body)

        if (!result.success) {
            return res.status(400).json({
                status: 'error',
                errors: result.error.errors.map((e) => ({
                    path: e.path.join('.'),
                    message: e.message
                }))
            })
        }

        req.body = result.data
        next()
    }
}
