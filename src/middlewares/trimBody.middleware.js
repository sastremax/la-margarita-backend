export const trimBody = function (req, res, next) {
    try {
        if (req.body && typeof req.body === 'object') {
            for (const key in req.body) {
                if (typeof req.body[key] === 'string') {
                    req.body[key] = req.body[key].trim()
                }
            }
        }
        next()
    } catch (error) {
        next(error)
    }
}
