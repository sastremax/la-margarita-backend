export const validateDTO = (schema, location = 'body') => {
    if (!schema || typeof schema.safeParse !== 'function') {
        throw new Error('Invalid schema provided to validateDTO middleware')
    }
    return (req, res, next) => {
        const input = location === 'query' ? req.query : req.body
        const result = schema.safeParse(input)
        if (!result.success) {
            return res.status(400).json({
                status: 'error',
                errors: result.error.errors.map((e) => ({
                    path: e.path.join('.'),
                    message: e.message
                }))
            })
        }
        if (location === 'query') req.query = result.data
        else req.body = result.data
        next()
    }
}
